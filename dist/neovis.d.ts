import type * as Neo4jTypes from 'neo4j-driver';
import * as vis from 'vis-network/standalone';
import { NeoVisEvents } from './events';
import type * as VisNetwork from "vis-network";
export declare const NEOVIS_DEFAULT_CONFIG: unique symbol;
export declare const NEOVIS_ADVANCED_CONFIG: unique symbol;
export { NeoVisEvents } from './events';
declare type NumberOrInteger = number | Neo4jTypes.Integer;
/**
 * Maps a type recursively and replace each non object type with the new type
 * @param <T> type to map
 * @param <New> type to map to for each non object type
 */
export declare type RecursiveMapTo<T, New> = {
    [P in keyof T]: T[P] extends object ? RecursiveMapTo<T[P], New> : New;
};
/**
 * Maps a type recursively and adds the ability for each object property to be a function that returns the same type
 * but replace each non object type with a function that returns the same type
 * @param <T> type to map
 * @param <PARAM_TYPE> type of parameter the functions get
 */
export declare type RecursiveMapToFunction<T, PARAM_TYPE> = {
    [P in keyof T]: T[P] extends object ? ((param: PARAM_TYPE) => T[P]) | (RecursiveMapToFunction<T[P], PARAM_TYPE>) : (param: PARAM_TYPE) => T[P];
};
/**
 * Cypher quarry
 */
export declare type Cypher = string;
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
        [label: string]: LabelConfig;
        [NEOVIS_DEFAULT_CONFIG]?: LabelConfig;
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
        [relationship: string]: RelationshipConfig;
        [NEOVIS_DEFAULT_CONFIG]?: RelationshipConfig;
    };
}
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
    defaultLabelConfig?: NonFlatNeoVisAdvanceConfig<VisNetwork.Node, Neo4jTypes.Node<number>>;
    defaultRelationshipsConfig?: NonFlatNeoVisAdvanceConfig<VisNetwork.Edge, Neo4jTypes.Relationship<number>>;
    labels?: Record<string, NonFlatNeoVisAdvanceConfig<VisNetwork.Node, Neo4jTypes.Node<number>>>;
    relationships?: Record<string, NonFlatNeoVisAdvanceConfig<VisNetwork.Edge, Neo4jTypes.Relationship<number>>>;
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
export declare class NeoVis {
    #private;
    _data: {
        nodes: vis.data.DataSet<Node, "id">;
        edges: vis.data.DataSet<Edge, "id">;
    };
    private _config;
    private _driver;
    private _database;
    private _query;
    private _container;
    /**
     * Get current vis nodes from the graph
     */
    get nodes(): VisNetwork.DataSet<Node>;
    /**
     * Get current vis edges from the graph
     */
    get edges(): VisNetwork.DataSet<Edge>;
    /**
     * Get current network
     */
    get network(): VisNetwork.Network | undefined;
    /**
     *
     * @constructor
     * @param {object} config - configures the visualization and Neo4j server connection
     */
    constructor(config: NeovisConfig | NonFlatNeovisConfig);
    _consoleLog(message: any, level?: string): void;
    _init(config: NeovisConfig | NonFlatNeovisConfig): void;
    _runCypher(cypher: Cypher, id: number): Promise<Neo4jTypes.Record<{
        [x: string]: any;
        [x: number]: any;
        [x: symbol]: any;
    }, PropertyKey, {
        [x: string]: number;
    }> | Neo4jTypes.Record<{
        [x: string]: any;
        [x: number]: any;
        [x: symbol]: any;
    }, PropertyKey, {
        [x: string]: number;
    }>[]>;
    _runFunction<NEO_TYPE>(func: Function, node: NEO_TYPE): Promise<any>;
    _buildStaticObject<VIS_TYPE>(staticConfig: VIS_TYPE, object: Node | Edge): void;
    _buildPropertyNameObject<VIS_TYPE, NEO_TYPE>(propertyNameConfig: RecursiveMapTo<VIS_TYPE, string>, object: Node | Edge, neo4jObj: NEO_TYPE): void;
    _buildCypherObject<VIS_TYPE>(cypherConfig: RecursiveMapTo<VIS_TYPE, Cypher>, object: Node | Edge, id: number): Promise<void>;
    _buildFunctionObject<VIS_TYPE, NEO_TYPE>(functionConfig: RecursiveMapToFunction<VIS_TYPE, NEO_TYPE>, object: Node | Edge, neo4jObj: NEO_TYPE): Promise<void>;
    /**
     * Build node object for vis from a neo4j Node
     * FIXME: move to private api
     * @param neo4jNode
     * @returns {{}}
     */
    buildNodeVisObject(neo4jNode: Neo4jTypes.Node<NumberOrInteger>): Promise<Partial<Node>>;
    /**
     * Build edge object for vis from a neo4j Relationship
     * @param r
     * @returns {{}}
     */
    buildEdgeVisObject(r: Neo4jTypes.Relationship<NumberOrInteger>): Promise<Partial<Edge>>;
    render(query?: Cypher): void;
    /**
     * Clear the data for the visualization
     */
    clearNetwork(): void;
    /**
     *
     * @param {string} eventType Event type to be handled
     * @param {handler} handler Handler to manage the event
     */
    registerOnEvent(eventType: NeoVisEvents, handler: Function): void;
    /**
     * Reset the config object and reload data
     * @param config
     */
    reinit(config: NeovisConfig | NonFlatNeovisConfig): void;
    /**
     * Clear the network and fetch live data form the server and reload the visualization
     */
    reload(): void;
    /**
     * Stabilize the visualization
     */
    stabilize(): void;
    /**
     * Execute an arbitrary Cypher query and re-render the visualization
     * @param query
     */
    renderWithCypher(query: Cypher): void;
    /**
     * Execute an arbitrary Cypher query and update the current visualization, retaning current nodes
     * This function will not change the original query given by renderWithCypher or the inital cypher.
     * @param query
     */
    updateWithCypher(query: Cypher): void;
}
export declare function objectToTitleHtml(neo4jObject: Neo4jTypes.Node<NumberOrInteger> | Neo4jTypes.Relationship<NumberOrInteger>, titleProperties: string[]): HTMLDivElement;
export declare function objectToTitleString(neo4jObject: Neo4jTypes.Node<NumberOrInteger> | Neo4jTypes.Relationship<NumberOrInteger>, titleProperties: string[]): string;
/**
 * @deprecated for migration only
 */
export interface OldLabelConfig {
    caption?: string;
    size?: string;
    community?: string;
    sizeCypher?: string;
    image?: string;
    font?: any;
    title_properties: string[];
}
/**
 * @deprecated for migration only
 */
export interface OldRelationshipConfig {
    thickness?: string;
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
        [label: string]: OldLabelConfig;
        [NEOVIS_DEFAULT_CONFIG]?: OldLabelConfig;
    };
    relationships?: {
        [relationship: string]: OldRelationshipConfig;
        [NEOVIS_DEFAULT_CONFIG]?: OldRelationshipConfig;
    };
    arrows?: boolean;
    hierarchical?: boolean;
    hierarchical_sort_method?: "hubsize" | "directed";
    initial_cypher?: string;
    console_debug?: boolean;
    encrypted?: "ENCRYPTION_OFF" | "ENCRYPTION_ON";
    trust?: "TRUST_ALL_CERTIFICATES" | "TRUST_SYSTEM_CA_SIGNED_CERTIFICATES";
}
/**
 * @deprecated will be removed in the future
 * migrate old config to the new one
 * @param oldNeoVisConfig 1.0.0 config object
 */
export declare function migrateFromOldConfig(oldNeoVisConfig: OldNeoVisConfig): NeovisConfig;
export default NeoVis;
