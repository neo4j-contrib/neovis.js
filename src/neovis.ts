'use strict';

import type * as Neo4jTypes from 'neo4j-driver';
import Neo4j from 'neo4j-driver';
import type * as Neo4jCore from 'neo4j-driver-core';
import { isInt, isNode, isPath, isRelationship } from 'neo4j-driver-core';
import * as vis from 'vis-network/standalone';
import { defaults } from './defaults';
import { EventController, EventFunctionTypes, NeoVisEvents } from './events';
import deepmerge from 'deepmerge';
import type * as VisNetwork from 'vis-network';
import {
	Cypher,
	Edge,
	LabelConfig,
	Neo4jConfig,
	NEOVIS_ADVANCED_CONFIG,
	NEOVIS_DEFAULT_CONFIG,
	NeovisConfig,
	NeovisDataConfig,
	Node,
	NonFlatLabelConfig,
	NonFlatNeoVisAdvanceConfig,
	NonFlatNeovisConfig,
	NonFlatRelationsipConfig,
	NumberOrInteger,
	RecursiveMapTo,
	RecursiveMapToFunction,
	RelationshipConfig
} from './types';
import { Font } from 'vis-network';

export * from './events';
export * from './types';

function isNeo4jDriver(neo4jConfig: Neo4jTypes.Driver | Neo4jConfig): neo4jConfig is Neo4jTypes.Driver {
	return neo4jConfig instanceof Neo4j.driver;
}

export class NeoVis {
	#data = {
		nodes: new vis.DataSet<Node>(),
		edges: new vis.DataSet<Edge>()
	};
	#network: VisNetwork.Network = null;
	#events = new EventController();
	#config: NeovisConfig | NonFlatNeovisConfig;
	#driver: Neo4jTypes.Driver;
	#database: string;
	#query: Cypher;
	#container: HTMLElement;

	/**
	 * All view nodes as DataSet
	 * @link https://visjs.github.io/vis-data/data/dataset.html
	 */
	get nodes(): VisNetwork.DataSet<Node> {
		return this.#data.nodes;
	}

	/**
	 * All view edges as DataSet
	 * @link https://visjs.github.io/vis-data/data/dataset.html
	 */
	get edges(): VisNetwork.DataSet<Edge> {
		return this.#data.edges;
	}

	/**
	 * @ignore for test purposes only
	 */
	get _config(): NeovisConfig | NonFlatNeovisConfig {
		return this.#config;
	}

	/**
	 * The vis network object
	 * @link https://visjs.github.io/vis-network/docs/network/#methods
	 */
	get network(): VisNetwork.Network | undefined {
		return this.#network;
	}

	/**
	 *
	 * @constructor
	 * @param {object} config - configures the visualization and Neo4j server connection
	 */
	constructor(config: NeovisConfig | NonFlatNeovisConfig) {
		this.#init(config);

		this.#consoleLog(config);
		this.#consoleLog(defaults);
	}

	#consoleLog(message: object | string, level = 'log'): void {
		if (level !== 'log' || this.#config.consoleDebug) {
			// eslint-disable-next-line no-console
			console[level](message);
		}
	}

	#init(config: NeovisConfig | NonFlatNeovisConfig): void {
		let defaultLabelConfig: NonFlatLabelConfig | LabelConfig;
		let defaultRelationshipConfig: NonFlatRelationsipConfig | RelationshipConfig;
		if (config.nonFlat && config.defaultLabelConfig) {
			defaultLabelConfig = config.defaultLabelConfig;
			if (defaultLabelConfig[NEOVIS_ADVANCED_CONFIG]) {
				throw new Error('non flat config can\'t use NEOVIS_ADVANCED_CONFIG, read the doc to see how the config should look');
			}
			defaultRelationshipConfig = config.defaultRelationshipsConfig;
			if (defaultRelationshipConfig[NEOVIS_ADVANCED_CONFIG]) {
				throw new Error('non flat config can\'t use NEOVIS_ADVANCED_CONFIG, read the doc to see how the config should look');
			}
		} else {
			defaultLabelConfig = (config as NeovisConfig).labels?.[NEOVIS_DEFAULT_CONFIG];
			defaultRelationshipConfig = (config as NeovisConfig).relationships?.[NEOVIS_DEFAULT_CONFIG];
		}
		if (defaultLabelConfig) {
			for (const key of Object.keys(config.labels)) {
				// getting out of my for not changing the original config object
				if (config.nonFlat) {
					(config as NonFlatNeovisConfig) = {
						...config as NonFlatNeovisConfig,
						labels: {
							...config.labels as Record<string, NonFlatLabelConfig>,
							[key]: deepmerge(defaultLabelConfig as NonFlatLabelConfig, config.labels?.[key] as NonFlatLabelConfig)
						},
					};
				} else {
					(config as NeovisConfig) = {
						...config as NeovisConfig,
						labels: {
							...config.labels as Record<string, LabelConfig>,
							[key]: {
								...deepmerge(defaultLabelConfig as LabelConfig, config.labels?.[key] as LabelConfig),
								[NEOVIS_ADVANCED_CONFIG]: deepmerge((defaultLabelConfig as LabelConfig)[NEOVIS_ADVANCED_CONFIG] ?? {}, (config.labels?.[key] as LabelConfig)[NEOVIS_ADVANCED_CONFIG] ?? {}),
							}
						}
					};
				}
			}
		}
		if (defaultRelationshipConfig) {
			for (const key of Object.keys(config.relationships)) {
				// getting out of my for not changing the original config object
				if (config.nonFlat) {
					(config as NonFlatNeovisConfig) = {
						...config as NonFlatNeovisConfig,
						relationships: {
							...config.relationships as Record<string, NonFlatRelationsipConfig>,
							[key]: deepmerge(defaultRelationshipConfig as NonFlatRelationsipConfig, config.relationships?.[key] as NonFlatRelationsipConfig)
						},
					};
				} else {
					(config as NeovisConfig) = {
						...config as NeovisConfig,
						relationships: {
							...config.relationships as Record<string, RelationshipConfig>,
							[key]: {
								...deepmerge(defaultRelationshipConfig as RelationshipConfig, config.relationships?.[key] as RelationshipConfig),
								[NEOVIS_ADVANCED_CONFIG]: deepmerge((defaultRelationshipConfig as RelationshipConfig)[NEOVIS_ADVANCED_CONFIG] ?? {}, (config.relationships?.[key] as RelationshipConfig)[NEOVIS_ADVANCED_CONFIG] ?? {}),
							}
						}
					};
				}
			}
		}
		this.#config = config;
		this.#driver = isNeo4jDriver(config.neo4j) ? config.neo4j : Neo4j.driver(
			config.neo4j?.serverUrl ?? defaults.neo4j.neo4jUri,
			Neo4j.auth.basic(
				config.neo4j?.serverUser ?? defaults.neo4j.neo4jUser,
				config.neo4j?.serverPassword ?? defaults.neo4j.neo4jPassword
			),
			deepmerge(defaults.neo4j.driverConfig, config.neo4j?.driverConfig ?? {})
		);
		this.#database = config.serverDatabase;
		this.#query = config.initialCypher ?? defaults.neo4j.initialQuery;
		this.#container = document.getElementById(config.containerId);
	}

	async #runCypher<T>(cypher: Cypher, id: number): Promise<T | T[]> {
		const session = this.#driver.session(this.#database && { database: this.#database });
		const results: T[] = [];

		try {
			const result = await session.readTransaction(tx => tx.run(cypher, { id }));
			for (const record of result.records) {
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

	#runFunction<VIS_TYPE, NEO_TYPE>(func: (neoObj: NEO_TYPE) => VIS_TYPE | Promise<VIS_TYPE>, node: NEO_TYPE): Promise<VIS_TYPE> | VIS_TYPE {
		if (typeof func === 'function') {
			return func(node);
		}
		throw new Error('Function type property field must be a function');
	}

	#buildStaticObject<VIS_TYPE>(staticConfig: VIS_TYPE, object: VIS_TYPE): void {
		if (staticConfig && typeof staticConfig === 'object') {
			for (const prop of Object.keys(staticConfig) as (keyof VIS_TYPE)[]) {
				const value = staticConfig[prop];
				if (value && typeof value === 'object') {
					if (!object[prop]) {
						object[prop as string] = {};
					}
					this.#buildStaticObject(value, object[prop] as VIS_TYPE[keyof VIS_TYPE] & object);
				} else {
					object[prop] = value;
				}
			}
		}
	}

	#buildPropertyNameObject<VIS_TYPE, NEO_TYPE>(propertyNameConfig: RecursiveMapTo<VIS_TYPE, string>, object: VIS_TYPE, neo4jObj: NEO_TYPE): void {
		if (propertyNameConfig && typeof propertyNameConfig === 'object') {
			for (const prop of Object.keys(propertyNameConfig) as (keyof VIS_TYPE)[]) {
				const property = propertyNameConfig[prop];
				if (typeof property === 'object') {
					if (!object[prop]) {
						object[prop as string] = {};
					}
					this.#buildPropertyNameObject(property as RecursiveMapTo<VIS_TYPE[keyof VIS_TYPE], string>, object[prop], neo4jObj);
				} else {
					const value = propertyNameConfig[prop];
					object[prop] = _retrieveProperty(value as string, neo4jObj);
				}
			}
		}
	}

	*#buildCypherObject<VIS_TYPE>(cypherConfig: RecursiveMapTo<VIS_TYPE, Cypher>, object: VIS_TYPE, id: number): Generator<Promise<void>> {
		if (cypherConfig && typeof cypherConfig === 'object') {
			for (const prop of Object.keys(cypherConfig) as (keyof VIS_TYPE)[]) {
				const value = cypherConfig[prop];
				if (value && typeof value === 'object') {
					if (!object[prop]) {
						object[prop as string] = {};
					}
					yield *this.#buildCypherObject(value as RecursiveMapTo<VIS_TYPE[keyof VIS_TYPE], Cypher>, object[prop], id);
				} else {
					const promise = this.#runCypher(value as string, id) as Promise<VIS_TYPE[keyof VIS_TYPE]>;
					yield Promise.resolve(promise).then(value => { object[prop] = value; } ) as Promise<void>;
				}
			}
		}
	}

	*#buildFunctionObject<VIS_TYPE, NEO_TYPE>(functionConfig: RecursiveMapToFunction<VIS_TYPE, NEO_TYPE>, object: VIS_TYPE, neo4jObj: NEO_TYPE): Generator<Promise<void>> {
		if (functionConfig && typeof functionConfig === 'object') {
			for (const prop of Object.keys(functionConfig) as (keyof VIS_TYPE)[]) {
				const func = functionConfig[prop];
				if (func && typeof func === 'object') {
					if (!object[prop]) {
						object[prop as string] = {};
					}
					yield *this.#buildFunctionObject(func as RecursiveMapToFunction<VIS_TYPE[keyof VIS_TYPE], NEO_TYPE>, object[prop], neo4jObj);
				} else {
					const promise = this.#runFunction(func as (neo: NEO_TYPE) => VIS_TYPE[keyof VIS_TYPE], neo4jObj);
					yield Promise.resolve(promise).then(value => { object[prop] = value; } ) as Promise<void>;
				}
			}
		}
	}

	async #buildVisObject<VIS_TYPE, NEO_TYPE>(
		config: NeovisDataConfig<VIS_TYPE, NEO_TYPE> | NonFlatNeoVisAdvanceConfig<VIS_TYPE, NEO_TYPE>, baseObject: VIS_TYPE, neo4jObject: NEO_TYPE, id: number
	): Promise<void> {
		if (!config) {
			return;
		}
		let staticConfig: VIS_TYPE;
		let cypherConfig: RecursiveMapTo<VIS_TYPE, Cypher>;
		let propertyConfig: RecursiveMapTo<VIS_TYPE, string>;
		let functionConfig: RecursiveMapToFunction<VIS_TYPE, NEO_TYPE>;

		if (this.#config.nonFlat) {
			if (config[NEOVIS_ADVANCED_CONFIG] !== undefined) {
				throw new Error('Advanced config and non flat config should not be together');
			}
			config = config as NonFlatNeoVisAdvanceConfig<VIS_TYPE, NEO_TYPE>;
			staticConfig = config.static;
			cypherConfig = config.cypher;
			propertyConfig = config.property;
			functionConfig = config.function;
		} else {
			config = config as NeovisDataConfig<VIS_TYPE, NEO_TYPE>;
			const advancedConfig = config[NEOVIS_ADVANCED_CONFIG];
			propertyConfig = config;
			if (advancedConfig !== undefined && typeof advancedConfig != 'object') {
				throw new Error('Advanced config should be an object. See documentation for details.');
			}
			cypherConfig = advancedConfig?.cypher;
			staticConfig = advancedConfig?.static;
			functionConfig = advancedConfig?.function;
		}
		this.#buildPropertyNameObject(propertyConfig, baseObject, neo4jObject);
		this.#buildStaticObject(staticConfig, baseObject);
		await Promise.all(this.#buildCypherObject(cypherConfig, baseObject, id));
		await Promise.all(this.#buildFunctionObject(functionConfig, baseObject, neo4jObject));
	}

	/**
	 * Build node object for vis from a neo4j Node
	 * @param neo4jNode
	 * @returns {{}}
	 */
	async #buildNodeVisObject(neo4jNode: Neo4jTypes.Node<NumberOrInteger>): Promise<Node> {
		const node: Partial<Node> = {};
		const label: string = neo4jNode.labels[0];

		const labelConfig: LabelConfig | NonFlatLabelConfig = this.#config?.labels?.[label] ?? (this.#config as NonFlatNeovisConfig)?.defaultLabelConfig ??
			(this.#config as NeovisConfig)?.labels?.[NEOVIS_DEFAULT_CONFIG];

		node.id = isInt(neo4jNode.identity) ? (neo4jNode.identity as Neo4jTypes.Integer).toInt() : neo4jNode.identity as number;
		node.raw = neo4jNode;

		await this.#buildVisObject(labelConfig, node as Node, neo4jNode, node.id);

		return node as Node;
	}


	/**
	 * Build edge object for vis from a neo4j Relationship
	 * @param r
	 * @returns {{}}
	 */
	async #buildEdgeVisObject(r: Neo4jTypes.Relationship<NumberOrInteger>): Promise<Edge> {
		const relationshipConfig = this.#config?.relationships?.[r.type] ?? (this.#config as NonFlatNeovisConfig).defaultRelationshipsConfig ??
			(this.#config as NeovisConfig)?.relationships?.[NEOVIS_DEFAULT_CONFIG];

		const edge: Partial<Edge> = {};
		edge.id = isInt(r.identity) ? (r.identity as Neo4jTypes.Integer).toInt() : r.identity as number;
		edge.from = isInt(r.start) ? (r.start as Neo4jTypes.Integer).toInt() : r.start as number;
		edge.to = isInt(r.end) ? (r.end as Neo4jTypes.Integer).toInt() : r.end as number;
		edge.raw = r;

		await this.#buildVisObject(relationshipConfig, edge as Edge, r, edge.id);

		return edge as Edge;
	}

	/**
	 * Renders the network
	 */
	render(query?: Cypher): void {

		// connect to Neo4j instance
		// run query
		let recordCount = 0;
		const _query = query || this.#query;
		const session = this.#driver.session(this.#database ? { database: this.#database } : undefined);
		const dataBuildPromises = [];
		session
			.run(_query, { limit: 30 })
			.subscribe({
				onNext: (record) => {
					recordCount++;

					this.#consoleLog('CLASS NAME');
					this.#consoleLog(record?.constructor.name);
					this.#consoleLog(record);

					const dataPromises = record.map(async (v: object) => {
						this.#consoleLog('Constructor:');
						this.#consoleLog(v?.constructor.name);
						if (isNode(v)) {
							const node = await this.#buildNodeVisObject(v);
							try {
								this.#data.nodes.update(node);
							} catch (e) {
								this.#consoleLog(e, 'error');
							}

						} else if (isRelationship(v)) {
							const edge = await this.#buildEdgeVisObject(v);
							this.#data.edges.update(edge);

						} else if (isPath(v)) {
							this.#consoleLog('PATH');
							this.#consoleLog(v);
							const startNode = await this.#buildNodeVisObject(v.start);
							const endNode = await this.#buildNodeVisObject(v.end);

							this.#data.nodes.update(startNode);
							this.#data.nodes.update(endNode);

							for (const obj of v.segments) {
								this.#data.nodes.update(await this.#buildNodeVisObject(obj.start));
								this.#data.nodes.update(await this.#buildNodeVisObject(obj.end));
								this.#data.edges.update(await this.#buildEdgeVisObject(obj.relationship));
							}

						} else if (Array.isArray(v)) {
							for (const obj of v) {
								this.#consoleLog('Array element constructor:');
								this.#consoleLog(obj?.constructor.name);
								if (isNode(obj)) {
									const node = await this.#buildNodeVisObject(obj);
									this.#data.nodes.update(node);

								} else if (isRelationship(obj)) {
									const edge = await this.#buildEdgeVisObject(obj);

									this.#data.edges.update(edge);
								}
							}
						}
					});
					dataBuildPromises.push(Promise.all(dataPromises));
				},
				onCompleted: async () => {
					await Promise.all(dataBuildPromises);
					await session.close();

					if (!this.#network) {
						const options = deepmerge(defaults.visJs, this.#config.visConfig ?? {});

						const container = this.#container;

						this.#consoleLog(this.#data.nodes);
						this.#consoleLog(this.#data.edges);

						this.#network = new vis.Network(container, this.#data, options);
					}
					this.#consoleLog('completed');
					setTimeout(
						() => {
							this.#network.stopSimulation();
						},
						10000
					);
					this.#events.generateEvent(NeoVisEvents.CompletionEvent, { recordCount });

					// eslint-disable-next-line @typescript-eslint/no-this-alias
					const neoVis = this;
					this.#network.on('click', function (this: VisNetwork.Network, params: { nodes: Node[], edges: Edge[], pointer: { DOM: VisNetwork.Position } }) {
						if (params.nodes.length > 0) {
							const nodeId = this.getNodeAt(params.pointer.DOM) as number;
							neoVis.#events.generateEvent(NeoVisEvents.ClickNodeEvent, {
								nodeId,
								node: neoVis.#data.nodes.get(nodeId)
							});
						} else if (params.edges.length > 0) {
							const edgeId = this.getEdgeAt(params.pointer.DOM) as number;
							neoVis.#events.generateEvent(NeoVisEvents.ClickEdgeEvent, {
								edgeId,
								edge: neoVis.#data.edges.get(edgeId)
							});
						}
					});
				},
				onError: (error) => {
					this.#consoleLog(error, 'error');
					this.#events.generateEvent(NeoVisEvents.ErrorEvent, { error });
				}
			} as Neo4jCore.ResultObserver);
	}

	/**
	 * Clear the data for the visualization
	 */
	clearNetwork(): void {
		this.#data.nodes.clear();
		this.#data.edges.clear();
	}


	/**
	 *
	 * @param {string} eventType Event type to be handled
	 * @param {Function} handler Handler to manage the event
	 */
	registerOnEvent<T extends NeoVisEvents>(eventType: T, handler: EventFunctionTypes[T]): void {
		this.#events.register(eventType, handler);
	}


	/**
	 * Reset the config object and reload data
	 * @param config
	 */
	reinit(config: NeovisConfig | NonFlatNeovisConfig): void {
		this.#init(config);
		this.render();
	}

	/**
	 * Clear the network and fetch live data form the server and reload the visualization
	 */
	reload(): void {
		this.clearNetwork();
		this.render();
	}

	/**
	 * Stabilize the visualization
	 */
	stabilize(): void {
		this.#network.stopSimulation();
		this.#consoleLog('Calling stopSimulation');
	}

	/**
	 * Execute an arbitrary Cypher query and re-render the visualization
	 * @param query
	 */
	renderWithCypher(query: Cypher): void {
		// this._config.initialCypher = query;
		this.clearNetwork();
		this.#query = query;
		this.render();
	}

	/**
	 * Execute an arbitrary Cypher query and update the current visualization, retaning current nodes
	 * This function will not change the original query given by renderWithCypher or the inital cypher.
	 * @param query
	 */
	updateWithCypher(query: Cypher): void {
		this.render(query);
	}
}

function _propertyToHtml<T extends { toString: () => string }>(key: string, value: T | T[]): string {
	if (Array.isArray(value) && value.length > 1) {
		let out = `<strong>${key}:</strong><br /><ul>`;
		for (const val of value) {
			out += `<li>${val}</li>`;
		}
		return out + '</ul>';
	}
	return `<strong>${key}:</strong> ${value}<br>`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _retrieveProperty<T>(prop: string, obj: any): T {
	if (typeof obj?.properties === 'object') {
		return isInt(obj.properties[prop]) ? obj.properties[prop].toInt() : obj.properties[prop];
	}
	throw new Error('Neo4j object is not properly constructed');
}

/**
 * create html display of the node
 * @param neo4jObject node to create html from
 * @param titleProperties which properties to map
 */
export function objectToTitleHtml(neo4jObject: Neo4jTypes.Node<NumberOrInteger> | Neo4jTypes.Relationship<NumberOrInteger>, titleProperties: string[]): HTMLDivElement {
	let titleString = '';
	if (!titleProperties) {
		titleProperties = Object.keys(neo4jObject.properties);
	}
	for (const key of titleProperties) {
		const propVal = _retrieveProperty(key, neo4jObject);
		if (propVal) {
			titleString += _propertyToHtml(key, propVal);
		}
	}
	const title = document.createElement('div');
	title.innerHTML = titleString;
	return title;
}

/**
 * create string display of the node
 * @param neo4jObject node to create title string from
 * @param titleProperties which properties to map
 */
export function objectToTitleString(neo4jObject: Neo4jTypes.Node<NumberOrInteger> | Neo4jTypes.Relationship<NumberOrInteger>, titleProperties: string[]): string {
	let title = '';
	if (!titleProperties) {
		titleProperties = Object.keys(neo4jObject.properties);
	}
	for (const key of titleProperties) {
		const propVal = _retrieveProperty(key, neo4jObject);
		if (propVal) {
			title += `${key}: ${propVal}\n`;
		}
	}
	return title;
}

/**
 * @deprecated for migration only
 */
export interface OldLabelConfig {
	caption?: string | ((node: Neo4jTypes.Node) => string);
	size?: number;
	community?: string;
	sizeCypher?: string;
	image?: string;
	font?: string | Font;
	title_properties?: string[];
}

/**
 * @deprecated for migration only
 */
export interface OldRelationshipConfig {
	thickness?: number;
	caption?: boolean | string;
}

/**
 * @deprecated for migration only
 */
export interface OldNeoVisConfig {
	container_id: string;
	server_url: string;
	server_user: string;
	server_password: string;
	server_database: string;
	labels?: {
		[label: string]: OldLabelConfig,
		[NEOVIS_DEFAULT_CONFIG]?: OldLabelConfig
	};
	relationships?: {
		[relationship: string]: OldRelationshipConfig,
		[NEOVIS_DEFAULT_CONFIG]?: OldRelationshipConfig
	};
	arrows?: boolean;
	hierarchical?: boolean;
	hierarchical_sort_method?: 'hubsize' | 'directed';
	initial_cypher?: string;
	console_debug?: boolean;
	encrypted?: 'ENCRYPTION_OFF' | 'ENCRYPTION_ON';
	trust?: 'TRUST_ALL_CERTIFICATES' | 'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES';
}

/**
 * @deprecated will be removed in the future
 * migrate old config to the new one
 * @param oldNeoVisConfig 1.0.0 config object
 */
export function migrateFromOldConfig(oldNeoVisConfig: OldNeoVisConfig): NeovisConfig {
	return {
		containerId: oldNeoVisConfig.container_id,
		initialCypher: oldNeoVisConfig.initial_cypher,
		consoleDebug: oldNeoVisConfig.console_debug,
		serverDatabase: oldNeoVisConfig.server_database,
		neo4j: {
			serverUrl: oldNeoVisConfig.server_url,
			serverUser: oldNeoVisConfig.server_user,
			serverPassword: oldNeoVisConfig.server_password,
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
		labels: oldNeoVisConfig.labels ? (Object.entries(oldNeoVisConfig.labels) as [string | typeof NEOVIS_DEFAULT_CONFIG, OldLabelConfig][])
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
						}, typeof oldLabelConfig.caption === 'function' ? { label: oldLabelConfig.caption } : {}),
						static: {
							font: oldLabelConfig.font,
							shape: oldLabelConfig.image ? 'image' : 'dot',
							image: oldLabelConfig.image
						}
					}
				};
				return newLabelsConfig;
			}, {}) : undefined,
		relationships: oldNeoVisConfig.relationships ? (Object.entries(oldNeoVisConfig.relationships) as [string | typeof NEOVIS_DEFAULT_CONFIG, OldRelationshipConfig][])
			.concat(oldNeoVisConfig.relationships[NEOVIS_DEFAULT_CONFIG] ? [[NEOVIS_DEFAULT_CONFIG, oldNeoVisConfig.relationships[NEOVIS_DEFAULT_CONFIG]]] : [])
			.reduce((newLabelsConfig, [relationship, oldRelationshipsConfig]) => {
				newLabelsConfig[relationship] = {
					value: oldRelationshipsConfig.thickness,
					label: typeof oldRelationshipsConfig.caption === 'string' ? oldRelationshipsConfig.caption : undefined,
					[NEOVIS_ADVANCED_CONFIG]: {
						function: {
							title: objectToTitleHtml
						}
					}
				};
				return newLabelsConfig;
			}, {}) : undefined
	};
}

export default NeoVis;
