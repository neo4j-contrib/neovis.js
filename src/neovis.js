'use strict';

import Neo4j from 'neo4j-driver';
import * as vis from 'vis-network/standalone';
import { defaults } from './defaults';
import { EventController, CompletionEvent, ClickEdgeEvent, DoubleClickEdgeEvent, ClickNodeEvent, DoubleClickNodeEvent, ErrorEvent } from './events';

export const NEOVIS_DEFAULT_CONFIG = Symbol();
export const NEOVIS_ADVANCED_CONFIG = Symbol();

export default class NeoVis {
	_nodes = {};
	_edges = {};
	_data = {};
	_network = null;
	_events = new EventController();
	_rightClickHandlers = {};

	/**
	 * Get current vis nodes from the graph
	 */
	get nodes() {
		return this._data.nodes;
	}

	/**
	 * Get current vis edges from the graph
	 */
	get edges() {
		return this._data.edges;
	}

	/**
	 *
	 * @constructor
	 * @param {object} config - configures the visualization and Neo4j server connection
	 *  {
	 *    container:
	 *    server_url:
	 *    server_password?:
	 *    server_username?:
	 *    server_database?:
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
		if (level !== 'log' || this._config.console_debug) {
			// eslint-disable-next-line no-console
			console[level](message);
		}
	}

	_init(config) {
		if (config.labels && config.labels[NEOVIS_DEFAULT_CONFIG]) {
			for (let key of Object.keys(config.labels)) {
				// getting out of my for not changing the original config object
				config = {
					...config,
					labels: {
						...config.labels,
						[key]: { ...config.labels[NEOVIS_DEFAULT_CONFIG], ...config.labels[key] }
					}
				};
			}
		}
		if (config.relationships && config.relationships[NEOVIS_DEFAULT_CONFIG]) {
			// getting out of my for not changing the original config object
			for (let key of Object.keys(config.relationships)) {
				config = {
					...config,
					relationships: {
						...config.relationships,
						[key]: { ...config.relationships[NEOVIS_DEFAULT_CONFIG], ...config.relationships[key] }
					}
				};
			}
		}
		this._config = config;
		this._encrypted = config.encrypted || defaults.neo4j.encrypted;
		this._trust = config.trust || defaults.neo4j.trust;
		this._driver = Neo4j.driver(
			config.server_url || defaults.neo4j.neo4jUri,
			Neo4j.auth.basic(config.server_user || defaults.neo4j.neo4jUser, config.server_password || defaults.neo4j.neo4jPassword),
			{
				encrypted: this._encrypted,
				trust: this._trust,
				maxConnectionPoolSize: 100,
				connectionAcquisitionTimeout: 10000,
				disableLosslessIntegers: true,
			}
		);
		this._database = config.server_database;
		this._query = config.initial_cypher || defaults.neo4j.initialQuery;
		this._container = document.getElementById(config.container_id);
		let eventHandlers = {
			[ClickNodeEvent]: [],
			[ClickEdgeEvent]: [],
			[DoubleClickNodeEvent]: [],
			[DoubleClickEdgeEvent]: [],
		};
		let RightClickHandlers = {};
		if (config.labels) {
			for (let key of Object.keys(config.labels)) {
				const onClickFunc = config.labels[key].click;
				if (onClickFunc) {
					if (typeof onClickFunc === 'function') {
						eventHandlers[ClickNodeEvent].push((values) => {
							if (values && typeof values === 'object' && values.node && values.node._neo4jLabel === key) {
								onClickFunc(values);
							}
						});
					}
				}
				const onDoubleClickFunc = config.labels[key].doubleClick;
				if (onDoubleClickFunc) {
					if (typeof onDoubleClickFunc === 'function') {
						eventHandlers[DoubleClickNodeEvent].push((values) => {
							if (values && typeof values === 'object' && values.node && values.node._neo4jLabel === key) {
								onDoubleClickFunc(values);
							}
						});
					}
				}

				const onRightClickConfig = config.labels[key].rightClick;
				if (onRightClickConfig) {
					if (typeof onRightClickConfig === 'object') {
						let nameList = [];
						let nameHandlers = {};
						for (let operationName of Object.keys(onRightClickConfig)) {
							nameList.push(operationName);
							nameHandlers[operationName] = onRightClickConfig[operationName];
						}
						RightClickHandlers[key] = [nameList, nameHandlers];
					}
				}
			}
		}
		if (config.relationships) {
			for (let key of Object.keys(config.relationships)) {
				const onClickFunc = config.relationships[key].click;
				if (onClickFunc) {
					if (typeof onClickFunc === 'function') {
						eventHandlers[ClickEdgeEvent].push((values) => {
							if (values && typeof values === 'object' && values.edge && values.edge._neo4jLabel === key) {
								onClickFunc(values);
							}
						});
					}
				}
				const onDoubleClickFunc = config.relationships[key].doubleClick;
				if (onDoubleClickFunc) {
					if (typeof onDoubleClickFunc === 'function') {
						eventHandlers[DoubleClickEdgeEvent].push((values) => {
							if (values && typeof values === 'object' && values.edge && values.edge._neo4jLabel === key) {
								onDoubleClickFunc(values);
							}
						});
					}
				}
			}
		}
		this._events = new EventController(eventHandlers);
		this._rightClickHandlers = RightClickHandlers;
	}

	_addNode(node) {
		this._nodes[node.id] = node;
	}

	_addEdge(edge) {
		this._edges[edge.id] = edge;
	}

	async _runCypher(cypher, id) {
		const session = this._driver.session(this._database && { database: this._database });
		let results = [];

		try {
			const result = await session.readTransaction(tx => tx.run(cypher, { id: id }));
			for (let record of result.records) {
				record.forEach((v) => {
					results.push(v);
				});
			}
		} finally {
			session.close();
		}

		if (results.length === 0) {
			return undefined;
		} else if (results.length === 1) {
			return results.pop();
		}

		return results;
	}

	_runFunction(func, node) {
		if (typeof func === 'function') {
			return func(node);
		}
		throw new Error('Function type property field must be a function');
	}

	_retrieveProperty(prop, node) {
		if (typeof node === 'object' && typeof node.properties === 'object') {
			return node.properties[prop];
		}
		throw new Error('Neo4j node is not properly constructed');
	}

	_buildStaticObject(staticConfig, object) {
		if (staticConfig && typeof staticConfig === 'object') {
			for (const prop of Object.keys(staticConfig)) {
				const value = staticConfig[prop];
				if (value && typeof value === 'object') {
					if (!object[prop]) {
						object[prop] = {};
					}
					this._buildStaticObject(value, object[prop]);
				} else {
					object[prop] = value;
				}
			}
		}
	}

	_buildPropertyNameObject(propertyNameConfig, object, neo4jObj) {
		if (propertyNameConfig && typeof propertyNameConfig === 'object') {
			for (const prop of Object.keys(propertyNameConfig)) {
				const value = propertyNameConfig[prop];
				if (value && typeof value === 'object') {
					if (!object[prop]) {
						object[prop] = {};
					}
					this._buildStaticObject(value, object[prop], neo4jObj);
				} else {
					const value = propertyNameConfig[prop];
					object[prop] = this._retrieveProperty(value, neo4jObj);
				}
			}
		}
	}

	async _buildCypherObject(cypherConfig, object, id) {
		if (cypherConfig && typeof cypherConfig === 'object') {
			for (const prop of Object.keys(cypherConfig)) {
				const value = cypherConfig[prop];
				if (value && typeof value === 'object') {
					if (!object[prop]) {
						object[prop] = {};
					}
					await this._buildCypherObject(value, object[prop], id);
				} else {
					object[prop] = await this._runCypher(value, id);
				}
			}
		}
	}

	_buildFunctionObject(functionConfig, object, neo4jObj) {
		if (functionConfig && typeof functionConfig === 'object') {
			for (const prop of Object.keys(functionConfig)) {
				const value = functionConfig[prop];
				if (value && typeof value === 'object') {
					if (!object[prop]) {
						object[prop] = {};
					}
					this._buildFunctionObject(value, object[prop], neo4jObj);
				} else {
					object[prop] = this._runFunction(value, neo4jObj);
				}
			}
		}
	}

	/**
	 * Build node object for vis from a neo4j Node
	 * FIXME: use config
	 * FIXME: move to private api
	 * @param neo4jNode
	 * @returns {{}}
	 */
	async buildNodeVisObject(neo4jNode) {
		let node = {};
		let label = neo4jNode.labels[0];

		let labelConfig = this._config && this._config.labels && (this._config.labels[label] || this._config.labels[NEOVIS_DEFAULT_CONFIG]);

		const advancedConfig = labelConfig && labelConfig[NEOVIS_ADVANCED_CONFIG];

		node.id = neo4jNode.identity;
		node.raw = neo4jNode;

		this._buildPropertyNameObject(labelConfig, node, neo4jNode);
		if (advancedConfig != undefined && typeof advancedConfig != 'object') {
			throw new Error('Advanced config should be an object. See documentation for details.');
		}
		if (advancedConfig && typeof advancedConfig === 'object') {
			const staticConfig = advancedConfig.static;
			this._buildStaticObject(staticConfig, node);

			const cypherConfig = advancedConfig.cypher;
			await this._buildCypherObject(cypherConfig, node, node.id);

			const functionConfig = advancedConfig.function;
			this._buildFunctionObject(functionConfig, node, neo4jNode);
		}
		return node;
	}


	/**
	 * Build edge object for vis from a neo4j Relationship
	 * @param r
	 * @returns {{}}
	 */
	async buildEdgeVisObject(r) {
		const nodeTypeConfig = this._config && this._config.relationships &&
			(this._config.relationships[r.type] || this._config.relationships[NEOVIS_DEFAULT_CONFIG]);

		const advancedConfig = nodeTypeConfig && nodeTypeConfig[NEOVIS_ADVANCED_CONFIG];

		let edge = {};
		edge.id = r.identity;
		edge.from = r.start;
		edge.to = r.end;
		edge.raw = r;

		this._buildPropertyNameObject(nodeTypeConfig, edge, r);
		if (advancedConfig != undefined && typeof advancedConfig != 'object') {
			throw new Error('Advanced config should be an object. See documentation for details.');
		}
		if (advancedConfig && typeof advancedConfig === 'object') {
			const staticConfig = advancedConfig.static;
			this._buildStaticObject(staticConfig, edge);

			const cypherConfig = advancedConfig.cypher;
			await this._buildCypherObject(cypherConfig, edge, edge.id);

			const functionConfig = advancedConfig.function;
			this._buildFunctionObject(functionConfig, edge, r);
		}

		return edge;
	}

	propertyToString(key, value) {
		if (Array.isArray(value) && value.length > 1) {
			let out = `<strong>${key}:</strong><br /><ul>`;
			for (let val of value) {
				out += `<li>${val}</li>`;
			}
			return out + '</ul>';
		}
		return `<strong>${key}:</strong> ${value}<br>`;
	}

	// public API

	render(query) {

		// connect to Neo4j instance
		// run query
		let recordCount = 0;
		const _query = query || this._query;
		let session = this._driver.session(this._database && { database: this._database });
		const dataBuildPromises = [];
		session
			.run(_query, { limit: 30 })
			.subscribe({
				onNext: (record) => {
					recordCount++;

					this._consoleLog('CLASS NAME');
					this._consoleLog(record && record.constructor.name);
					this._consoleLog(record);

					const dataPromises = Object.values(record.toObject()).map(async (v) => {
						this._consoleLog('Constructor:');
						this._consoleLog(v && v.constructor.name);
						if (v instanceof Neo4j.types.Node) {
							let node = await this.buildNodeVisObject(v);
							try {
								this._addNode(node);
							} catch (e) {
								this._consoleLog(e, 'error');
							}

						} else if (v instanceof Neo4j.types.Relationship) {
							let edge = await this.buildEdgeVisObject(v);
							this._addEdge(edge);

						} else if (v instanceof Neo4j.types.Path) {
							this._consoleLog('PATH');
							this._consoleLog(v);
							let startNode = await this.buildNodeVisObject(v.start);
							let endNode = await this.buildNodeVisObject(v.end);

							this._addNode(startNode);
							this._addNode(endNode);

							for (let obj of v.segments) {
								this._addNode(await this.buildNodeVisObject(obj.start));
								this._addNode(await this.buildNodeVisObject(obj.end));
								this._addEdge(await this.buildEdgeVisObject(obj.relationship));
							}

						} else if (v instanceof Array) {
							for (let obj of v) {
								this._consoleLog('Array element constructor:');
								this._consoleLog(obj && obj.constructor.name);
								if (obj instanceof Neo4j.types.Node) {
									let node = await this.buildNodeVisObject(obj);
									this._addNode(node);

								} else if (obj instanceof Neo4j.types.Relationship) {
									let edge = await this.buildEdgeVisObject(obj);

									this._addEdge(edge);
								}
							}
						}
					});
					dataBuildPromises.push(Promise.all(dataPromises));
				},
				onCompleted: async () => {
					await Promise.all(dataBuildPromises);
					session.close();

					if (this._network && this._network.body.data.nodes.length > 0) {
						this._data.nodes.update(Object.values(this._nodes));
						this._data.edges.update(Object.values(this._edges));
					} else {
						let options = {
							nodes: {
								//shape: 'dot',
								font: {
									size: 26,
									strokeWidth: 7
								},
								scaling: {}
							},
							edges: {
								arrows: {
									to: { enabled: this._config.arrows || false } // FIXME: handle default value
								},
								length: 200
							},
							layout: {
								improvedLayout: false,
								hierarchical: {
									enabled: this._config.hierarchical || false,
									sortMethod: this._config.hierarchical_sort_method || 'hubsize'
								}
							},
							physics: { // TODO: adaptive physics settings based on size of graph rendered
								// enabled: true,
								// timestep: 0.5,
								// stabilization: {
								//     iterations: 10
								// }

								adaptiveTimestep: true,
								// barnesHut: {
								//     gravitationalConstant: -8000,
								//     springConstant: 0.04,
								//     springLength: 95
								// },
								stabilization: {
									iterations: 200,
									fit: true
								}
							}
						};

						const container = this._container;
						this._data = {
							nodes: new vis.DataSet(Object.values(this._nodes)),
							edges: new vis.DataSet(Object.values(this._edges))
						};

						this._consoleLog(this._data.nodes);
						this._consoleLog(this._data.edges);

						// Create duplicate node for any this reference relationships
						// NOTE: Is this only useful for data model type data
						// this._data.edges = this._data.edges.map(
						//     function (item) {
						//          if (item.from == item.to) {
						//             const newNode = this._data.nodes.get(item.from)
						//             delete newNode.id;
						//             const newNodeIds = this._data.nodes.add(newNode);
						//             this._consoleLog("Adding new node and changing this-ref to node: " + item.to);
						//             item.to = newNodeIds[0];
						//          }
						//          return item;
						//     }
						// );
						this._network = new vis.Network(container, this._data, options);
					}
					this._consoleLog('completed');
					setTimeout(
						() => {
							this._network.stopSimulation();
						},
						10000
					);
					this._events.generateEvent(CompletionEvent, { record_count: recordCount });

					let neoVis = this;
					this._network.on('click', function (params) {
						if (params.nodes.length > 0) {
							params.nodes.forEach((nodeId) => {
								neoVis._events.generateEvent(ClickNodeEvent, { nodeId: nodeId, node: neoVis._nodes[nodeId] });
							});
						} else if (params.edges.length > 0) {
							params.edges.forEach((edgeId) => {
								neoVis._events.generateEvent(ClickEdgeEvent, { edgeId: edgeId, edge: neoVis._edges[edgeId] });
							});
						}
					});

					this._network.on('doubleClick', function (params) {
						if (params.nodes.length > 0) {
							params.nodes.forEach((nodeId) => {
								neoVis._events.generateEvent(DoubleClickNodeEvent, { nodeId: nodeId, node: neoVis._nodes[nodeId] });
							});
						} else if (params.edges.length > 0) {
							params.edges.forEach((edgeId) => {
								neoVis._events.generateEvent(DoubleClickEdgeEvent, { edgeId: edgeId, edge: neoVis._edges[edgeId] });
							});
						}
					});
					this.registerRightClickEvent();
				},
				onError: (error) => {
					this._consoleLog(error, 'error');
					this._events.generateEvent(ErrorEvent, { error_msg: error });
				}
			});
	}

	remove(query) {

		// connect to Neo4j instance
		// run query
		let recordCount = 0;
		const _query = query || this._query;
		let session = this._driver.session(this._database && { database: this._database });
		const dataBuildPromises = [];
		let nodesToRemove = {};
		let edgesToRemove = {};
		session
			.run(_query, { limit: 30 })
			.subscribe({
				onNext: (record) => {
					recordCount++;

					this._consoleLog('CLASS NAME');
					this._consoleLog(record && record.constructor.name);
					this._consoleLog(record);

					const dataPromises = Object.values(record.toObject()).map(async (v) => {
						this._consoleLog('Constructor:');
						this._consoleLog(v && v.constructor.name);
						if (v instanceof Neo4j.types.Node) {
							let nodeID = v.identity.toInt();
							this._removeNodeByID(nodeID, nodesToRemove);

						} else if (v instanceof Neo4j.types.Relationship) {
							let edgeID = v.identity.toInt();
							this._removeEdgeByID(edgeID, edgesToRemove);

						} else if (v instanceof Neo4j.types.Path) {
							this._consoleLog('PATH');
							this._consoleLog(v);
							let startNodeID = v.start.identity.toInt();
							let endNodeID = v.end.identity.toInt();

							this._removeNodeByID(startNodeID, nodesToRemove);
							this._removeNodeByID(endNodeID, nodesToRemove);

							for (let obj of v.segments) {
								this._removeNodeByID(obj.start.identity.toInt(), nodesToRemove);
								this._removeNodeByID(obj.end.identity.toInt(), nodesToRemove);
								this._removeEdgeByID(obj.relationship.identity.toInt(), edgesToRemove);
							}

						} else if (v instanceof Array) {
							for (let obj of v) {
								this._consoleLog('Array element constructor:');
								this._consoleLog(obj && obj.constructor.name);
								if (obj instanceof Neo4j.types.Node) {
									let nodeID = obj.identity.toInt();
									this._removeNodeByID(nodeID, nodesToRemove);

								} else if (obj instanceof Neo4j.types.Relationship) {
									let edgeID = obj.identity.toInt();

									this._removeEdgeByID(edgeID, edgesToRemove);
								}
							}
						}
					});
					dataBuildPromises.push(Promise.all(dataPromises));
				},
				onCompleted: async () => {
					await Promise.all(dataBuildPromises);
					session.close();

					if(this._network && this._network.body.data.nodes.length > 0) {
						this._data.nodes.remove(Object.values(nodesToRemove));
						this._data.edges.remove(Object.values(edgesToRemove));
					}
					this._consoleLog('completed');
					setTimeout(
						() => {
							this._network.stopSimulation();
						},
						10000
					);
					this._events.generateEvent(CompletionEvent, { record_count: recordCount });
				},
				onError: (error) => {
					this._consoleLog(error, 'error');
					this._events.generateEvent(ErrorEvent, { error_msg: error });
				}
			});
	}

	/**
	 * Clear the data for the visualization
	 */
	clearNetwork() {
		this._neo4jNodes = {};
		this._neo4jEdges = {};
		this._nodes = {};
		this._edges = {};
		this._network.setData([]);
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
	 * Stabilize the visualization
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

	/**
	 * Execute an arbitrary Cypher query and update the current visualization, retaning current nodes
	 * This function will not change the original query given by renderWithCypher or the inital cypher.
	 * @param query
	 */
	updateWithCypher(query) {
		this.render(query);
	}

	removeWithCypher(query) {
		this.remove(query);
	}

	nodeToHtml(neo4jNode, title_properties) {
		let title = '';
		if (!title_properties) {
			title_properties = Object.keys(neo4jNode.properties);
		}
		for (const key of title_properties) {
			const propVal = this._retrieveProperty(key, neo4jNode);
			if (propVal) {
				title += this.propertyToString(key, propVal);
			}
		}
		return title;
	}

	registerRightClickEvent() {
		let neovis = this;
		this._network.off('oncontext');
		this._network.on('oncontext', function (params) {
			$(document).off('mousedown');
			params.event.preventDefault();
			$('.custom-menu').finish().toggle(100);
			$('.custom-menu').css({
				top: params.event.pageY + 'px',
				left: params.event.pageX + 'px'
			});
			const selectedNodeID = neovis._network.getNodeAt(params.pointer.DOM);
			if (selectedNodeID) {
				const node = neovis._nodes[selectedNodeID];
				const label = node._neo4jLabel;
				$('.custom-menu').empty();
				for (let item in neovis._rightClickHandlers[label][0]) {
					const name = neovis._rightClickHandlers[label][0][item];
					$('.custom-menu').append(`<li data-action="${name}">${name}</li>`);
				}
			}
			// If the menu element is clicked
			$('.custom-menu li').click(function(){
				// This is the triggered action name
				const selectedOperation = $(this).attr('data-action');
				const node = neovis._nodes[selectedNodeID];
				const label = node._neo4jLabel;
				const operationFunc = neovis._rightClickHandlers[label][1][selectedOperation];
				if (typeof operationFunc === 'function') {
					operationFunc(node);
				}

				// Hide it AFTER the action was triggered
				$('.custom-menu').hide(100);
			});
			$(document).bind('mousedown', function (e) {
				// If the clicked element is not the menu
				if (!$(e.target).parents('.custom-menu').length > 0) {
					// Hide it
					$('.custom-menu').hide(100);
				}
			});
		});
	}

}