'use strict';

import Neo4j from 'neo4j-driver';
import * as vis from 'vis-network/standalone';
import { defaults } from './defaults';
import { NeoVisEvents, EventController } from './events';
import deepmerge from 'deepmerge';

export const NEOVIS_DEFAULT_CONFIG = Symbol();
export const NEOVIS_ADVANCED_CONFIG = Symbol();

export { NeoVisEvents } from './events';

export class NeoVis {
	_data = {
		nodes: new vis.DataSet(),
		edges: new vis.DataSet()
	};
	#network = null;
	#events = new EventController();

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
	 * Get current network
	 */
	get network() {
		return this.#network;
	}

	/**
	 *
	 * @constructor
	 * @param {object} config - configures the visualization and Neo4j server connection
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

		if (config.labels?.[NEOVIS_DEFAULT_CONFIG]) {
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
		if (config.relationships?.[NEOVIS_DEFAULT_CONFIG]) {
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
		this._driver = config.neo4j instanceof Neo4j.driver ? config.neo4j : Neo4j.driver(
			config.neo4j?.server_url ?? defaults.neo4jUri,
			Neo4j.auth.basic(
				config.neo4j?.server_user ?? defaults.neo4j.neo4jUser,
				config.neo4j?.server_password ?? defaults.neo4j.neo4jPassword
			),
			deepmerge(defaults.neo4j.driverConfig, config.neo4j?.driverConfig ?? {})
		);
		this._database = config.server_database;
		this._query = config.initial_cypher ?? defaults.neo4j.initialQuery;
		this._container = document.getElementById(config.container_id);
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
			await session.close();
		}

		if (results.length === 0) {
			return undefined;
		} else if (results.length === 1) {
			return results.pop();
		}

		return results;
	}

	async _runFunction(func, node) {
		if (typeof func === 'function') {
			return await func(node);
		}
		throw new Error('Function type property field must be a function');
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
					object[prop] = _retrieveProperty(value, neo4jObj);
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

	async _buildFunctionObject(functionConfig, object, neo4jObj) {
		if (functionConfig && typeof functionConfig === 'object') {
			for (const prop of Object.keys(functionConfig)) {
				const func = functionConfig[prop];
				if (func && typeof func === 'object') {
					if (!object[prop]) {
						object[prop] = {};
					}
					await this._buildFunctionObject(func, object[prop], neo4jObj);
				} else {
					object[prop] = await this._runFunction(func, neo4jObj);
				}
			}
		}
	}

	async #buildVisObject(config, baseObejct, neo4jObject) {
		if(!config) {
			return;
		}
		let staticConfig;
		let cypherConfig;
		let propertyConfig;
		let functionConfig;

		const advancedConfig = config[NEOVIS_ADVANCED_CONFIG];

		if(this._config.non_flat) {
			if (advancedConfig !== undefined) {
				throw new Error('Advanced config and non flat config should not be together');
			}
			staticConfig = config.static;
			cypherConfig = config.cypher;
			propertyConfig = config.property;
			functionConfig = config.function;
		}  else {
			propertyConfig = config;
			if (advancedConfig !== undefined && typeof advancedConfig != 'object') {
				throw new Error('Advanced config should be an object. See documentation for details.');
			}
			cypherConfig = advancedConfig?.cypher;
			staticConfig = advancedConfig?.static;
			functionConfig = advancedConfig?.function;
		}
		this._buildPropertyNameObject(propertyConfig, baseObejct, neo4jObject);
		this._buildStaticObject(staticConfig, baseObejct);
		await this._buildCypherObject(cypherConfig, baseObejct, neo4jObject);
		await this._buildFunctionObject(functionConfig, baseObejct, neo4jObject);
	}

	/**
	 * Build node object for vis from a neo4j Node
	 * FIXME: move to private api
	 * @param neo4jNode
	 * @returns {{}}
	 */
	async buildNodeVisObject(neo4jNode) {
		let node = {};
		let label = neo4jNode.labels[0];

		let labelConfig = this._config?.labels?.[label] ?? this._config?.defaultLabelConfig ?? this._config?.labels?.[NEOVIS_DEFAULT_CONFIG];

		node.id = neo4jNode.identity;
		node.raw = neo4jNode;

		await this.#buildVisObject(labelConfig, node, neo4jNode);

		return node;
	}


	/**
	 * Build edge object for vis from a neo4j Relationship
	 * @param r
	 * @returns {{}}
	 */
	async buildEdgeVisObject(r) {
		const relationshipConfig = this._config?.relationships?.[r.type] ?? this._config?.defaultRelationshipConfig ??
			this._config?.relationships?.[NEOVIS_DEFAULT_CONFIG];

		let edge = {};
		edge.id = r.identity;
		edge.from = r.start;
		edge.to = r.end;
		edge.raw = r;

		await this.#buildVisObject(relationshipConfig, edge, r);

		return edge;
	}

	// public API

	render(query) {

		// connect to Neo4j instance
		// run query
		let recordCount = 0;
		const _query = query || this._query;
		const session = this._driver.session(this._database ?? { database: this._database });
		const dataBuildPromises = [];
		session
			.run(_query, { limit: 30 })
			.subscribe({
				onNext: (record) => {
					recordCount++;

					this._consoleLog('CLASS NAME');
					this._consoleLog(record?.constructor.name);
					this._consoleLog(record);

					const dataPromises = Object.values(record.toObject()).map(async (v) => {
						this._consoleLog('Constructor:');
						this._consoleLog(v?.constructor.name);
						if (v instanceof Neo4j.types.Node) {
							let node = await this.buildNodeVisObject(v);
							try {
								this._data.nodes.update(node);
							} catch (e) {
								this._consoleLog(e, 'error');
							}

						} else if (v instanceof Neo4j.types.Relationship) {
							let edge = await this.buildEdgeVisObject(v);
							this._data.edges.update(edge);

						} else if (v instanceof Neo4j.types.Path) {
							this._consoleLog('PATH');
							this._consoleLog(v);
							let startNode = await this.buildNodeVisObject(v.start);
							let endNode = await this.buildNodeVisObject(v.end);

							this._data.nodes.update(startNode);
							this._data.nodes.update(endNode);

							for (let obj of v.segments) {
								this._data.nodes.update(await this.buildNodeVisObject(obj.start));
								this._data.nodes.update(await this.buildNodeVisObject(obj.end));
								this._data.edges.update(await this.buildEdgeVisObject(obj.relationship));
							}

						} else if (v instanceof Array) {
							for (let obj of v) {
								this._consoleLog('Array element constructor:');
								this._consoleLog(obj?.constructor.name);
								if (obj instanceof Neo4j.types.Node) {
									let node = await this.buildNodeVisObject(obj);
									this._data.nodes.update(node);

								} else if (obj instanceof Neo4j.types.Relationship) {
									let edge = await this.buildEdgeVisObject(obj);

									this._data.edges.update(edge);
								}
							}
						}
					});
					dataBuildPromises.push(Promise.all(dataPromises));
				},
				onCompleted: async () => {
					await Promise.all(dataBuildPromises);
					await session.close();

					if (!(this.#network?.body.data.nodes.length > 0)) {
						let options = deepmerge(defaults.visJs, this._config.visConfig ?? {});

						const container = this._container;

						this._consoleLog(this._data.nodes);
						this._consoleLog(this._data.edges);

						this.#network = new vis.Network(container, this._data, options);
					}
					this._consoleLog('completed');
					setTimeout(
						() => {
							this.#network.stopSimulation();
						},
						10000
					);
					this.#events.generateEvent(NeoVisEvents.CompletionEvent, { record_count: recordCount });

					let neoVis = this;
					this.#network.on('click', function (params) {
						if (params.nodes.length > 0) {
							let nodeId = this.getNodeAt(params.pointer.DOM);
							neoVis.#events.generateEvent(NeoVisEvents.ClickNodeEvent, {
								nodeId: nodeId,
								node: neoVis._data.nodes.get(nodeId)
							});
						} else if (params.edges.length > 0) {
							let edgeId = this.getEdgeAt(params.pointer.DOM);
							neoVis.#events.generateEvent(NeoVisEvents.ClickEdgeEvent, {
								edgeId: edgeId,
								edge: neoVis._data.edges.get(edgeId)
							});
						}
					});
				},
				onError: (error) => {
					this._consoleLog(error, 'error');
					this.#events.generateEvent(NeoVisEvents.ErrorEvent, { error_msg: error });
				}
			});
	}

	/**
	 * Clear the data for the visualization
	 */
	clearNetwork() {
		this._data.nodes.clear();
		this._data.edges.clear();
	}


	/**
	 *
	 * @param {string} eventType Event type to be handled
	 * @param {handler} handler Handler to manage the event
	 */
	registerOnEvent(eventType, handler) {
		this.#events.register(eventType, handler);
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
	 * Clear the network and fetch live data form the server and reload the visualization
	 */
	reload() {
		this.clearNetwork();
		this.render();
	}

	/**
	 * Stabilize the visualization
	 */
	stabilize() {
		this.#network.stopSimulation();
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
}

function _propertyToHtml(key, value) {
	if (Array.isArray(value) && value.length > 1) {
		let out = `<strong>${key}:</strong><br /><ul>`;
		for (let val of value) {
			out += `<li>${val}</li>`;
		}
		return out + '</ul>';
	}
	return `<strong>${key}:</strong> ${value}<br>`;
}

function _retrieveProperty(prop, obj) {
	if (typeof obj?.properties === 'object') {
		return obj.properties[prop];
	}
	throw new Error('Neo4j object is not properly constructed');
}

export function objectToTitleHtml(neo4jNode, title_properties) {
	let titleString = '';
	if (!title_properties) {
		title_properties = Object.keys(neo4jNode.properties);
	}
	for (const key of title_properties) {
		const propVal = _retrieveProperty(key, neo4jNode);
		if (propVal) {
			titleString += _propertyToHtml(key, propVal);
		}
	}
	const title = document.createElement('div');
	title.innerHTML = titleString;
	return title;
}

export function objectToTitleString(neo4jNode, title_properties) {
	let title = '';
	if (!title_properties) {
		title_properties = Object.keys(neo4jNode.properties);
	}
	for (const key of title_properties) {
		const propVal = _retrieveProperty(key, neo4jNode);
		if (propVal) {
			title += `${key}: ${propVal}\n`;
		}
	}
	return title;
}

export function migrateFromOldConfig(oldNeoVisConfig) {
	return {
		container_id: oldNeoVisConfig.container_id,
		initial_cypher: oldNeoVisConfig.initial_cypher,
		console_debug: oldNeoVisConfig.console_debug,
		server_database: oldNeoVisConfig.server_database,
		neo4j: {
			server_url: oldNeoVisConfig.server_url,
			server_user: oldNeoVisConfig.server_url,
			server_password: oldNeoVisConfig.server_password,
			driverConfig: oldNeoVisConfig.encrypted || oldNeoVisConfig.trust ? {
				encrypted: oldNeoVisConfig.encrypted,
				trust: oldNeoVisConfig.trust
			} : undefined
		},
		visConfig: oldNeoVisConfig.arrows || oldNeoVisConfig.hierarchical ? {
			edges: oldNeoVisConfig.arrows ? {
				arrows: {
					to: {
						enabled: oldNeoVisConfig.arrows
					}
				}
			} : undefined,
			layout: oldNeoVisConfig.hierarchical ? {
				enabled: oldNeoVisConfig.hierarchical,
				sortMethod: oldNeoVisConfig.hierarchical_sort_method
			} : undefined
		} : undefined,
		labels: oldNeoVisConfig.labels ? Object.entries(oldNeoVisConfig.labels)
			.concat(oldNeoVisConfig.labels?.[NEOVIS_DEFAULT_CONFIG] ? [[NEOVIS_DEFAULT_CONFIG, oldNeoVisConfig.labels[NEOVIS_DEFAULT_CONFIG]]] : [])
			.reduce((newLabelsConfig, [label, oldLabelConfig]) => {
				newLabelsConfig[label] = {
					label: typeof oldLabelConfig.caption !== 'function' ? oldLabelConfig.caption : undefined,
					value: oldLabelConfig.size,
					group: oldLabelConfig.community,
					[NEOVIS_ADVANCED_CONFIG]: {
						cypher: oldLabelConfig.sizeCypher ? {
							value: oldLabelConfig.sizeCypher
						} : undefined,
						function: deepmerge({
							title: (props) => objectToTitleHtml(props, oldLabelConfig.title_properties)
						}, typeof oldLabelConfig.caption === 'function' ? { label: oldLabelConfig.caption } : {}) ,
						static: {
							font: oldLabelConfig.font,
							shape: oldLabelConfig.image ? 'image' : 'dot',
							image: oldLabelConfig.image
						}
					}
				};
				return newLabelsConfig;
			}, {}) : undefined,
		relationships: oldNeoVisConfig.relationships ? Object.entries(oldNeoVisConfig.relationships)
			.concat(oldNeoVisConfig.relationships[NEOVIS_DEFAULT_CONFIG] ? [[NEOVIS_DEFAULT_CONFIG, oldNeoVisConfig.relationships[NEOVIS_DEFAULT_CONFIG]]] : [])
			.reduce((newLabelsConfig, [relationship, oldRelationshipsConfig]) => {
				newLabelsConfig[relationship] = {
					value: oldRelationshipsConfig.thickness,
					[NEOVIS_ADVANCED_CONFIG]: {
						function: {
							title: oldRelationshipsConfig.caption ? objectToTitleHtml : undefined
						}
					}
				};
				return newLabelsConfig;
			}, {}) : undefined
	};
}

export default NeoVis;