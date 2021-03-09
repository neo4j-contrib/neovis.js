'use strict';

import * as vis from 'vis-network/standalone';
import { defaults } from './defaults';
import { EventController, CompletionEvent } from './events';
// TODO: how can this class code design can be improved?
export class NeoVisRest {
	_nodes = {};
	_edges = {};
	_nodes_properties = {};
	_nodes_data_set = null;
	_edges_data_set = null;
	_data = {};
	_network = null;
	_events = new EventController();

	/**
	 *
	 * @constructor
	 * @param {object} config - configures the visualization and Neo4j server connection
	 *  {
	 *    container:
	 *    server_url:
	 *    server_password?:
	 *    server_username?:
	 *    labels:
	 *
	 *  }
	 *
	 */
	constructor(config) {
		this._init(config);

		this._consoleLog(config);
		this._consoleLog(defaults);
	}

	_consoleLog(message, level = 'log') {
		if(level !== 'log' || this._config.console_debug) {
			// eslint-disable-next-line no-console
			console[level](message);
		}
	}

	_init(config) {
		this._config = config;
		this._encrypted = config.encrypted || defaults.neo4j.encrypted;
		this._trust = config.trust || defaults.neo4j.trust;
		this._rest_driver = config.rest_driver; 
		this._groupSelector = config.group_selector;
		this._query = config.initial_cypher || defaults.neo4j.initialQuery;
		this._container = document.getElementById(config.container_id);
	}

	// public API
	render() {
		return this._rest_driver.fetch(this._query, null, ['graph']).then(response => {
			return this._renderInitialGraph(response.results[0].data);
		});
	}

	/* Renders the graph generated from the query parameter without clearing the 
	 * existing nodes and edges.
	 */
	renderIteractive(query) {
		this._rest_driver.fetch(query, null, ['graph', 'row']).then(response => {
			// Build the graph in the Vis.js format
			let graphResult = this._buildVisGraph(response.results[0].data);

			this._consoleLog('renderIteractive');
			this._consoleLog(this._data.nodes);
			this._consoleLog(this._data.edges);

			let nodes_to_add = [];
			let edges_to_add = [];
			let nodes_ids = {};
			let edges_ids = {};
			// Add all nodes
			for (let i = 0; i < graphResult.nodes.length; i++) {
				let node = graphResult.nodes[i];
				if (!this._data.nodes.get(node.id) && !(node.id in nodes_ids)) {
					nodes_to_add.push(node);
					nodes_ids[node.id] = true;
				}
			}

			// Add all edges
			for (let i = 0; i < graphResult.edges.length; i++) {
				let edge = graphResult.edges[i];
				if (!this._data.edges.get(edge.id) && !(edge.id in edges_ids)) {
					edges_to_add.push(edge);
					edges_ids[edge.id] = true;
				}	
			}

			this._data.nodes.add(nodes_to_add);
			this._data.edges.add(edges_to_add);

			return this._network;
		});
	}

	_renderInitialGraph(neo4JData) {
		let options = this.getOptions();

		let graphResult = this._buildVisGraph(neo4JData);
		let nodes = [];
		let edges = [];
		let nodes_ids = {};
		let edges_ids = {};

		this._consoleLog(neo4JData);

		// Add all nodes
		for (let i = 0; i < graphResult.nodes.length; i++) {
			let node = graphResult.nodes[i];
			if (!(node.id in nodes_ids)) {
				nodes_ids[node.id] = true;
				nodes.push(node);
			}
		}

		// Add all edges
		for (let i = 0; i < graphResult.edges.length; i++) {
			let edge = graphResult.edges[i];
			if (!(edge.id in edges_ids)) {
				edges_ids[edge.id] = true;
				edges.push(edge);
			}
		}

		// Render 
		const container = this._container;
		this._data = {
			nodes: new vis.DataSet(Object.values(nodes)),
			edges: new vis.DataSet(Object.values(edges))
		};

		this._consoleLog(this._data.nodes);
		this._consoleLog(this._data.edges);

		this._network = new vis.Network(container, this._data, options);
		this._events.generateEvent(CompletionEvent, {record_count: nodes.length + edges.length});
		return this._network;
	}

	_buildVisGraph(responseData) {
		let result = {
			nodes: [],
			edges: []
		};
		for (let i = 0; i < responseData.length; i++) {
			let filtered_row = this._groupSelector.filterRow(responseData[i]);
			let entryGraph = filtered_row.graph;
			// iterate through the list of nodes
			for (let j = 0; j < entryGraph.nodes.length; j++) {
				let node = this.buildNodeVisObject(entryGraph.nodes[j]);
				try {
					result.nodes.push(node);
				} catch (e) {
					this._consoleLog(e, 'error');
				}
			}
			// iterate through the list of links (also known as edges or relationships)
			for (let k = 0; k < entryGraph.relationships.length; k++) {
				let edge = this.buildEdgeVisObject(entryGraph.relationships[k]);
				result.edges.push(edge);
			}
		}
		return result;
	}


	reduceNetworkToNodeNeighborhood(node_id) {
		let result = this.getNodeOutsiders(node_id);
		this.removeNodesAndEdges(result.node_ids, result.edge_ids);
	}

	getNodeOutsiders(node_id) {
		let edges = this.edges();
		let neighbors = this.getNodeNeighbors(node_id);
		let neighbor_ids = neighbors.node_ids_map;
		let result = {
			edge_ids: [],
			node_ids: []
		};
		neighbor_ids[node_id] = node_id;
		let outsiders_found = {};
		
		
		for (let edge of edges) {
			let remove_edge = false;
			if (!(edge.from in neighbor_ids) && !(edge.from in outsiders_found)) {
				outsiders_found[edge.from] = edge.id;
				result.node_ids.push(edge.from);
				remove_edge = true;
			}
			
			if (!(edge.to in neighbor_ids) && !(edge.to in outsiders_found)){
				outsiders_found[edge.to] = edge.id;
				result.node_ids.push(edge.to);
				remove_edge = true;
			}

			if (remove_edge)
				result.edge_ids.push(edge.id);
		}
		return result;
	}

	getNodeNeighbors(node_id) {
		let edges = this.edges();
		let result = {
			edge_ids: [],
			node_ids: [],
			node_ids_map: {}
		};

		
		for (let edge of edges) {
			if (edge.from == node_id) {
				result.edge_ids.push(edge.id);
				result.node_ids.push(edge.to);
				result.node_ids_map[edge.to] = edge.id;
			} else if (edge.to == node_id) {
				result.edge_ids.push(edge.id);
				result.node_ids.push(edge.from);
				result.node_ids_map[edge.from] = edge.id;
			}
		}
		return result;
	}

	removeNodesAndEdges(node_ids, edge_ids) {
		if (this._data.nodes) {
			this._data.nodes.remove(node_ids);
		}
		if (this._data.edges) {
			this._data.edges.remove(edge_ids);
		}
	}

	edges() {
		return this._data.edges.get();
	}

	nodes() {
		return this._data.nodes.get();
	}

	/**
	 * Build node object for vis from a neo4j Node
	 * FIXME: use config
	 * FIXME: move to private api
	 * @param neo4jNode
	 * @returns {{}}
	 */
	buildNodeVisObject(neo4jNode) {
		let node = {};
		let label = neo4jNode.labels[0];

		let labelConfig = this._config && this._config.labels && this._config.labels[label];

		const captionKey = labelConfig && labelConfig['caption'];
		const sizeKey = labelConfig && labelConfig['size'];
		const communityKey = labelConfig && labelConfig['community'];

		node.id = parseInt(neo4jNode.id);

		// Save the node properties
		this._nodes_properties[node.id] = neo4jNode.properties;

		// node size

		if (typeof sizeKey === 'number') {
			node.value = sizeKey;
		} else {
			let sizeProp = neo4jNode.properties[sizeKey];

			if (sizeProp && typeof sizeProp === 'number') {
				// property value is a number, OK to use
				node.value = sizeProp;
			} else if (sizeProp && typeof sizeProp === 'object' && Neo4j.isInt(sizeProp)) {
				// property value might be a Neo4j Integer, check if we can call toNumber on it:
				if (sizeProp.inSafeRange()) {
					node.value = sizeProp.toNumber();
				} else {
					// couldn't convert to Number, use default
					node.value = 1.0;
				}
			} else {
				node.value = 1.0;
			}
		}

		// node caption
		if (typeof captionKey === 'function') {
			node.label = captionKey(neo4jNode);
		} else {
			node.label = neo4jNode.properties[captionKey] || label || '';
		}

		// community
		// behavior: color by value of community property (if set in config), then color by label
		if (this._groupSelector) {
			node.group = this._groupSelector.selectGroup(neo4jNode.properties);
		} else if (!communityKey) {
			node.group = label;
		} else {
			try {
				if (neo4jNode.properties[communityKey]) {
					node.group = neo4jNode.properties[communityKey].toNumber() || label || 0;  // FIXME: cast to Integer

				} else {
					node.group = 0;
				}

			} catch (e) {
				node.group = 0;
			}
		}
		return node;
	}

	/**
	 * Build edge object for vis from a neo4j Relationship
	 * @param r
	 * @returns {{}}
	 */
	buildEdgeVisObject(r) {
		const nodeTypeConfig = this._config && this._config.relationships && this._config.relationships[r.type];
		let captionKey = nodeTypeConfig && nodeTypeConfig.caption;
		let color = nodeTypeConfig && nodeTypeConfig.color;
		let title = nodeTypeConfig && nodeTypeConfig.title;

		// Assign all nodeTypeConfig parameters into the edge
		let edge = {};

		edge.id = parseInt(r.id);
		edge.from = parseInt(r.startNode);
		edge.to = parseInt(r.endNode);
		

		// Handle custom label
		if (typeof captionKey === 'boolean') {
			if (!captionKey) {
				edge.label = '';
			} else {
				edge.label = r.type;
			}
		} else if (captionKey && typeof captionKey === 'string') {
			edge.label = r.properties[captionKey] || '';
		} else {
			edge.label = r.type;
		}

		if (color)
			edge.color = color;
		
		if (title)
			edge.title = title;


		return edge;
	}


	getOptions() {
		return {
			nodes: {
				shape: 'dot',
				font: {
					size: 14,
					strokeWidth: 5
				},
				scaling: {
					label: {
						enabled: false
					}
				}
			},
			groups: this._config.groups,
			edges: {
				arrows: {
					to: {enabled: this._config.arrows || false} // FIXME: handle default value
				},
				color: {
					color: '#ABABAB',
					opacity: 0.75
				},
				width: 0.25
			},
			layout: this._config.layout,
			physics: this._config.physics
		};
	}

	/**
	 * Clear the data for the visualization
	 */
	clearNetwork() {
		this._nodes_properties = {};
		this._data = {
			nodes: new vis.DataSet(Object.values({})),
			edges: new vis.DataSet(Object.values({}))
		};
		this._network.setData(this._data);
	}


	/**
	 *
	 * @param {string} eventType Event type to be handled
	 * @param {callback} handler Handler to manage the event
	 */
	registerOnEvent(eventType, handler) {
		this._events.register(eventType, handler);
	}


	/**
	 * Reset the config object and reload data
	 * @param config
	 */
	reinit(config) {
		this._init(config);
		this.render();
	}

	/**
	 * Fetch live data form the server and reload the visualization
	 */
	reload() {
		this.clearNetwork();
		this.render();
	}

	/**
	 * Stabilize the visuzliation
	 */
	stabilize() {
		this._network.stopSimulation();
		this._consoleLog('Calling stopSimulation');
	}

	/**
	 * Execute an arbitrary Cypher query and re-render the visualization
	 * @param query
	 */
	renderWithCypher(query) {
		// this._config.initial_cypher = query;
		this.clearNetwork();
		this._query = query;
		this.render();
	}
}
