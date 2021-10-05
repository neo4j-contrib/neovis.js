'use strict';

import Neo4j from 'neo4j-driver';
import { isNode, isPath, isInt, isRelationship } from 'neo4j-driver-core';
import type * as Neo4jCore from 'neo4j-driver-core';
import type * as Neo4jTypes from 'neo4j-driver';
import * as vis from 'vis-network/standalone';
import { defaults } from './defaults';
import { EventController, NeoVisEvents } from './events';
import deepmerge from 'deepmerge';
import type * as VisNetwork from 'vis-network';

export const NEOVIS_DEFAULT_CONFIG = Symbol();
export const NEOVIS_ADVANCED_CONFIG = Symbol();

export { NeoVisEvents } from './events';
type NumberOrInteger = number | Neo4jTypes.Integer

/**
 * Maps a type recursively and replace each non object type with the new type
 * @param <T> type to map
 * @param <New> type to map to for each non object type
 */
export type RecursiveMapTo<T, New> = {
	[P in keyof T]: T[P] extends object ? RecursiveMapTo<T[P], New> : New
};

/**
 * Maps a type recursively and adds the ability for each object property to be a function that returns the same type
 * but replace each non object type with a function that returns the same type
 * @param <T> type to map
 * @param <PARAM_TYPE> type of parameter the functions get
 */
export type RecursiveMapToFunction<T, PARAM_TYPE> = {
	[P in keyof T]: T[P] extends object ? ((param: PARAM_TYPE) => T[P]) | (RecursiveMapToFunction<T[P], PARAM_TYPE>) : (param: PARAM_TYPE) => T[P]
};

/**
 * Cypher quarry
 */
export type Cypher = string;

export interface NeoVisAdvanceConfig<VIS_TYPE, NEO_TYPE> {
	/**
	 * Static values that will the same for every node/relationship
	 * */
	static?: VIS_TYPE;
	/**
	 * Cypher that will be called for every object (will look the same as
	 */
	cypher?: RecursiveMapTo<VIS_TYPE, Cypher>;
	function?: RecursiveMapToFunction<VIS_TYPE, NEO_TYPE>;
}

export interface NonFlatNeoVisAdvanceConfig<VIS_TYPE, NEO_TYPE> extends NeoVisAdvanceConfig<VIS_TYPE, NEO_TYPE> {
	property?: RecursiveMapTo<VIS_TYPE, string>;
}

type NeovisDataConfig<VIS_TYPE, NEO_TYPE> =
	RecursiveMapTo<VIS_TYPE, string>
	& { [NEOVIS_ADVANCED_CONFIG]?: NeoVisAdvanceConfig<VIS_TYPE, NEO_TYPE> };

/**
 * A mapper between neo4j node properties names to vis-network node config
 * @link https://visjs.github.io/vis-network/docs/network/nodes.html
 */
export interface LabelConfig extends RecursiveMapTo<VisNetwork.Node, string> {
	/**
	 * advance options which allow for:
	 * mapping static options to each node
	 * mapping cypher to run for each node to determine vis-network node option
	 * mapping function that gets the neo4j node and returns vis-network node option
	 */
	[NEOVIS_ADVANCED_CONFIG]?: NeoVisAdvanceConfig<VisNetwork.Node, Neo4jTypes.Node<number>>;
}

/**
 * A mapper between neo4j relationship properties names to vis-network edge config
 * @link https://visjs.github.io/vis-network/docs/network/edges.html
 */
export interface RelationshipConfig extends RecursiveMapTo<VisNetwork.Edge, string> {
	/**
	 * advance options which allow for:
	 * mapping static options to each edge
	 * mapping cypher to run for each relationship to determine vis-network edge option
	 * mapping function that gets the neo4j relationship and returns vis-network edge option
	 */
	[NEOVIS_ADVANCED_CONFIG]?: NeoVisAdvanceConfig<VisNetwork.Edge, Neo4jTypes.Relationship<number>>;
}

export interface Neo4jConfig {
	/**
	 * neo4j server
	 * @example bolt://localhost:7687
	 */
	server_url?: string;
	server_user?: string;
	server_password?: string;
	/**
	 * @link https://neo4j.com/docs/api/javascript-driver/current/function/index.html#configuration
	 */
	/**
	 * All view nodes as DataSet
	 * @link https://visjs.github.io/vis-data/data/dataset.html
	 */
	driverConfig?: Neo4jTypes.Config;
}

export interface BaseNeovisConfig {
	/**
	 * Html id of the element you want Neovis to render on
	 */
	container_id: string;
	/**
	 * database name you want to connect to
	 * @default neo4j
	 */
	server_database?: string;
	/**
	 * Neo4j Driver instance or configuration to make one
	 */
	neo4j?: Neo4jTypes.Driver | Neo4jConfig;
	/**
	 * Vis network config to override neovis defaults
	 * @link https://visjs.github.io/vis-network/docs/network/#options
	 */
	visConfig?: VisNetwork.Options;

	/**
	 * The Cypher query that will get the data
	 */
	initial_cypher?: Cypher;
	/**
	 * Should output debug messages to console
	 * @default false
	 */
	console_debug?: boolean;


	/**
	 * Tells Neovis is the config is flat or not
	 * @default false
	 */
	nonFlat?: boolean;
}

/**
 * @example
 * ```js
 * //simple
 * {
 *      container_id: "viz",
 *      neo4j: {
 *      	server_url: "bolt://localhost:7687",
 *      	server_user: "neo4j",
 *      	server_password: "sorts-swims-burglaries"
 *      },
 *      labels: {
 *      	Character: {
 *      		label: "name",
 *      		value: "pagerank",
 *      		group: "community"
 *      	}
 *      },
 *      relationships: {
 *      	INTERACTS: {
 *      		value: "weight"
 *      	}
 *      },
 *      initial_cypher: "MATCH (n)-[r:INTERACTS]->(m) RETURN n,r,m"
 * }
 * // advance
 * {
 *      container_id: 'viz',
 *      neo4j: {
 *      	server_url: 'bolt://localhost:7687',
 *      	server_user: 'neo4j',
 *      	server_password: 'gland-presentation-worry'
 *      },
 *      visConfig: {
 *      	nodes: {
 *      		shape: 'square'
 *      	},
 *      	edges: {
 *      		arrows: {
 *      			to: {enabled: true}
 *      		}
 *      	},
 *      },
 *      labels: {
 *      	Character: {
 *      		label: 'pagerank',
 *      		group: 'community',
 *      		[Neovis.NEOVIS_ADVANCED_CONFIG]: {
 *      			cypher: {
 *      				value: "MATCH (n) WHERE id(n) = $id RETURN n.size"
 *      			},
 *      			function: {
 *      				title: (node) => {
 *      					return viz.nodeToHtml(node, undefined);
 *      				}
 *      			},
 *      		}
 *      	}
 *      },
 *      relationships: {
 *      	INTERACTS: {
 *      		value: 'weight',
 *      		[Neovis.NEOVIS_ADVANCED_CONFIG]: {
 *      			function: {
 *      				title: (edge) => {
 *      					return viz.nodeToHtml(edge, undefined);
 *      				}
 *      			},
 *      		}
 *      	}
 *      },
 *      initial_cypher: 'MATCH (n)-[r]->(m) RETURN n,r,m'
 * }
 * ```
 */
export interface NeovisConfig extends BaseNeovisConfig {
	nonFlat?: false;
	/**
	 * @example ```javascript
	 *{
	 * 	Character: {
	 * 	label: 'pagerank',
	 * 		group: 'community',
	 * 		[Neovis.NEOVIS_ADVANCED_CONFIG]: {
	 * 			cypher: {
	 * 				value: "MATCH (n) WHERE id(n) = $id RETURN n.size"
	 * 			},
	 * 			function: {
	 * 				title: (node) => {
	 * 					return viz.nodeToHtml(node, undefined);
	 * 				}
	 * 			},
	 * 		}
	 * 	}
	 * }
	 * ```
	 */
	labels?: {
		[label: string]: LabelConfig,
		[NEOVIS_DEFAULT_CONFIG]?: LabelConfig
	};
	/**
	 * @example
	 * ``` js
	 * {
	 *      INTERACTS: {
	 *  	    value: 'weight',
	 *  	    [Neovis.NEOVIS_ADVANCED_CONFIG]: {
	 *  	    	function: {
	 *  	    		title: (edge) => {
	 *  	    			return viz.nodeToHtml(edge, undefined);
	 *  	    		}
	 *  	    	},
	 *  	    }
	 *      }
	 * }
	 * ```
	 */
	relationships?: {
		[relationship: string]: RelationshipConfig,
		[NEOVIS_DEFAULT_CONFIG]?: RelationshipConfig
	};
}

type NonFlatLabelConfig = NonFlatNeoVisAdvanceConfig<VisNetwork.Node, Neo4jTypes.Node<number>>;

type NonFlatRelationsipConfig = NonFlatNeoVisAdvanceConfig<VisNetwork.Edge, Neo4jTypes.Relationship<number>>;

/**
 * non flat version of the configuration (without Symbols)
 * look at the normal config for more information
 *
 * @example
 * ```js
 * {
 *      container_id: 'viz',
 *      nonFlat: true,
 *      neo4j: {
 *      	server_url: 'bolt://localhost:7687',
 *      	server_user: 'neo4j',
 *      	server_password: 'gland-presentation-worry'
 *      },
 *      visConfig: {
 *      	nodes: {
 *      		shape: 'square'
 *      	},
 *      	edges: {
 *      		arrows: {
 *      			to: {enabled: true}
 *      		}
 *      	},
 *      },
 *      labels: {
 *      	Character: {
 *      		property: {
 *      		    label: 'pagerank',
 *      		    group: 'community'
 *      	    }
 *      		cypher: {
 *      			value: "MATCH (n) WHERE id(n) = $id RETURN n.size"
 *      		},
 *      		function: {
 *      			title: (node) => {
 *      				return viz.nodeToHtml(node, undefined);
 *      			}
 *      		}
 *      	}
 *      },
 *      relationships: {
 *      	INTERACTS: {
 *              property: {
 *      		    value: 'weight'
 *      	    }
 *      		function: {
 *      			title: (edge) => {
 *      				return viz.nodeToHtml(edge, undefined);
 *      			}
 *      		}
 *      	}
 *      },
 *      initial_cypher: 'MATCH (n)-[r]->(m) RETURN n,r,m'
 * }
 * ```
 */
export interface NonFlatNeovisConfig extends BaseNeovisConfig {
	nonFlat: true;
	defaultLabelConfig?: NonFlatLabelConfig;
	defaultRelationshipsConfig?: NonFlatRelationsipConfig;
	labels?: Record<string, NonFlatLabelConfig>;
	relationships?: Record<string, NonFlatRelationsipConfig>;
}

/**
 * A network node with raw neo4j node
 */
export interface Node extends VisNetwork.Node {
	/**
	 * @link https://neo4j.com/docs/api/javascript-driver/current/class/src/graph-types.js~Node.html
	 */
	id: number;
	raw: Neo4jTypes.Node<NumberOrInteger>;
}

/**
 * A network edge with raw neo4j relationship
 */
export interface Edge extends VisNetwork.Edge {
	/**
	 * https://neo4j.com/docs/api/javascript-driver/current/class/src/graph-types.js~Relationship.html
	 */
	id: number;
	raw: Neo4jTypes.Relationship<NumberOrInteger>;
}

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

	#consoleLog(message: any, level = 'log'): void {
		if (level !== 'log' || this.#config.console_debug) {
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
							...config.labels as Record<string, RelationshipConfig>,
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
			config.neo4j?.server_url ?? defaults.neo4j.neo4jUri,
			Neo4j.auth.basic(
				config.neo4j?.server_user ?? defaults.neo4j.neo4jUser,
				config.neo4j?.server_password ?? defaults.neo4j.neo4jPassword
			),
			deepmerge(defaults.neo4j.driverConfig, config.neo4j?.driverConfig ?? {})
		);
		this.#database = config.server_database;
		this.#query = config.initial_cypher ?? defaults.neo4j.initialQuery;
		this.#container = document.getElementById(config.container_id);
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

	async #runFunction<NEO_TYPE>(func: Function, node: NEO_TYPE): Promise<any> {
		if (typeof func === 'function') {
			return await func(node);
		}
		throw new Error('Function type property field must be a function');
	}

	#buildStaticObject<VIS_TYPE>(staticConfig: VIS_TYPE, object: Node | Edge): void {
		if (staticConfig && typeof staticConfig === 'object') {
			for (const prop of Object.keys(staticConfig)) {
				const value = staticConfig[prop];
				if (value && typeof value === 'object') {
					if (!object[prop]) {
						object[prop] = {};
					}
					this.#buildStaticObject(value, object[prop]);
				} else {
					object[prop] = value;
				}
			}
		}
	}

	#buildPropertyNameObject<VIS_TYPE, NEO_TYPE>(propertyNameConfig: RecursiveMapTo<VIS_TYPE, string>, object: Node | Edge, neo4jObj: NEO_TYPE): void {
		if (propertyNameConfig && typeof propertyNameConfig === 'object') {
			for (const prop of Object.keys(propertyNameConfig)) {
				const value = propertyNameConfig[prop];
				if (value && typeof value === 'object') {
					if (!object[prop]) {
						object[prop] = {};
					}
					this.#buildStaticObject(value, object[prop]);
				} else {
					const value = propertyNameConfig[prop];
					object[prop] = _retrieveProperty(value, neo4jObj);
				}
			}
		}
	}

	async #buildCypherObject<VIS_TYPE>(cypherConfig: RecursiveMapTo<VIS_TYPE, Cypher>, object: Node | Edge, id: number): Promise<void> {
		if (cypherConfig && typeof cypherConfig === 'object') {
			for (const prop of Object.keys(cypherConfig)) {
				const value = cypherConfig[prop];
				if (value && typeof value === 'object') {
					if (!object[prop]) {
						object[prop] = {};
					}
					await this.#buildCypherObject(value, object[prop], id);
				} else {
					object[prop] = await this.#runCypher(value, id);
				}
			}
		}
	}

	async #buildFunctionObject<VIS_TYPE, NEO_TYPE>(functionConfig: RecursiveMapToFunction<VIS_TYPE, NEO_TYPE>, object: Node | Edge, neo4jObj: NEO_TYPE): Promise<void> {
		if (functionConfig && typeof functionConfig === 'object') {
			for (const prop of Object.keys(functionConfig)) {
				const func = functionConfig[prop];
				if (func && typeof func === 'object') {
					if (!object[prop]) {
						object[prop] = {};
					}
					await this.#buildFunctionObject(func, object[prop], neo4jObj);
				} else {
					object[prop] = await this.#runFunction(func, neo4jObj);
				}
			}
		}
	}

	async #buildVisObject<VIS_TYPE, NEO_TYPE>(
		config: NeovisDataConfig<VIS_TYPE, NEO_TYPE> | NonFlatNeoVisAdvanceConfig<VIS_TYPE, NEO_TYPE>, baseObject: Node | Edge, neo4jObject: NEO_TYPE
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
		await this.#buildCypherObject(cypherConfig, baseObject, baseObject.id);
		await this.#buildFunctionObject(functionConfig, baseObject, neo4jObject);
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

		await this.#buildVisObject(labelConfig, node as Node, neo4jNode);

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

		await this.#buildVisObject(relationshipConfig, edge as Edge, r);

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
				onNext: (record: Neo4jTypes.Record) => {
					recordCount++;

					this.#consoleLog('CLASS NAME');
					this.#consoleLog(record?.constructor.name);
					this.#consoleLog(record);

					const dataPromises = record.map(async (v: object) => {
						this.#consoleLog('Constructor:');
						this.#consoleLog(v?.constructor.name);
						if ((isNode as unknown as (obj: object) => obj is Neo4jCore.Node)(v)) {
							const node = await this.#buildNodeVisObject(v);
							try {
								this.#data.nodes.update(node);
							} catch (e) {
								this.#consoleLog(e, 'error');
							}

						} else if ((isRelationship as unknown as (obj: object) => obj is Neo4jCore.Relationship)(v)) {
							const edge = await this.#buildEdgeVisObject(v);
							this.#data.edges.update(edge);

						} else if ((isPath as unknown as (obj: object) => obj is Neo4jCore.Path)(v)) {
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
								if ((isNode as unknown as (obj: object) => obj is Neo4jCore.Node)(obj)) {
									const node = await this.#buildNodeVisObject(obj);
									this.#data.nodes.update(node);

								} else if ((isRelationship as unknown as (obj: object) => obj is Neo4jCore.Relationship)(obj)) {
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
					this.#events.generateEvent(NeoVisEvents.CompletionEvent, { record_count: recordCount });

					// eslint-disable-next-line @typescript-eslint/no-this-alias
					const neoVis = this;
					this.#network.on('click', function (params) {
						if (params.nodes.length > 0) {
							const nodeId = this.getNodeAt(params.pointer.DOM);
							neoVis.#events.generateEvent(NeoVisEvents.ClickNodeEvent, {
								nodeId: nodeId,
								node: neoVis.#data.nodes.get(nodeId)
							});
						} else if (params.edges.length > 0) {
							const edgeId = this.getEdgeAt(params.pointer.DOM);
							neoVis.#events.generateEvent(NeoVisEvents.ClickEdgeEvent, {
								edgeId: edgeId,
								edge: neoVis.#data.edges.get(edgeId)
							});
						}
					});
				},
				onError: (error) => {
					this.#consoleLog(error, 'error');
					this.#events.generateEvent(NeoVisEvents.ErrorEvent, { error_msg: error });
				}
			} as object);
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
	registerOnEvent(eventType: NeoVisEvents, handler: Function): void {
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
		// this._config.initial_cypher = query;
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

function _propertyToHtml(key: string, value: any) {
	if (Array.isArray(value) && value.length > 1) {
		let out = `<strong>${key}:</strong><br /><ul>`;
		for (const val of value) {
			out += `<li>${val}</li>`;
		}
		return out + '</ul>';
	}
	return `<strong>${key}:</strong> ${value}<br>`;
}

function _retrieveProperty(prop: string, obj: any): any {
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
	font?: any;
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