import * as VisNetwork from "vis-network";
import * as Neo4j from "neo4j-driver";

export const NEOVIS_DEFAULT_CONFIG: unique symbol;
export const NEOVIS_ADVANCED_CONFIG: unique symbol;

/**
 * events
 */
export enum NeoVisEvents {
    CompletionEvent = 'completed',
    ClickNodeEvent = 'clickNode',
    ClickEdgeEvent = 'clickEdge',
    ErrorEvent = 'error'
}

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
    [NEOVIS_ADVANCED_CONFIG]?: NeoVisAdvanceConfig<VisNetwork.Node, Neo4j.Node<number>>;
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
    [NEOVIS_ADVANCED_CONFIG]?: NeoVisAdvanceConfig<VisNetwork.Edge, Neo4j.Relationship<number>>;
}

export interface Neo4jConfig {
    /**
     * neo4j server
     * @example bolt://localhost:7687
     */
    server_url: string;
    server_user: string;
    server_password: string;
    /**
     * @link https://neo4j.com/docs/api/javascript-driver/current/function/index.html#static-function-driver
     */
    driverConfig: Neo4j.Config;
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
 *      		[NeoVis.NEOVIS_ADVANCED_CONFIG]: {
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
 *      		[NeoVis.NEOVIS_ADVANCED_CONFIG]: {
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
export interface NeovisConfig {
    /**
     * Html id of the element you want NeoVis to render on
     */
    container_id: string;
    /**
     * database name you want to connect to
     * @default neo4j
     */
    server_database: string;
    /**
     * Neo4j Driver instance or configuration to make one
     */
    neo4j: Neo4j.Driver | Neo4jConfig;
    /**
     * Vis network config to override neovis defaults
     * @link https://visjs.github.io/vis-network/docs/network/#options
     */
    visConfig: VisNetwork.Options;
    /**
     * @example ```javascript
     *{
     * 	Character: {
     * 	label: 'pagerank',
     * 		group: 'community',
     * 		[NeoVis.NEOVIS_ADVANCED_CONFIG]: {
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
     *  	    [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
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
    /**
     * The Cypher query that will get the data
     */
    initial_cypher?: Cypher;
    /**
     * Should output debug messages to console
     * @default false
     */
    console_debug?: boolean;
}

/**
 * A network node with raw neo4j node
 */
export interface Node extends VisNetwork.Node {
    /**
     * @link https://neo4j.com/docs/api/javascript-driver/current/class/src/graph-types.js~Node.html
     */
    raw: Neo4j.Node
}

/**
 * A network edge with raw neo4j relationship
 */
export interface Edge extends VisNetwork.Edge {
    /**
     * https://neo4j.com/docs/api/javascript-driver/current/class/src/graph-types.js~Relationship.html
     */
    raw: Neo4j.Relationship
}

export declare class Neovis {
    constructor(config: NeovisConfig);

    /**
     * All view nodes as DataSet
     * @link https://visjs.github.io/vis-data/data/dataset.html
     */
    get nodes(): VisNetwork.DataSet<Node>;

    /**
     * All view edges as DataSet
     * @link https://visjs.github.io/vis-data/data/dataset.html
     */
    get edges(): VisNetwork.DataSet<Edge>;

    /**
     * The vis network object
     * @link https://visjs.github.io/vis-network/docs/network/#methods
     */
    get network(): VisNetwork.Network | undefined;

    /**
     * Renders the network
     */
    render(): void;

    /**
     * Clear the data for the visualization
     */
    clearNetwork(): void;

    /**
     *
     * @param {string} eventType Event type to be handled
     * @param {handler} handler Handler to manage the event
     */
    registerOnEvent(eventType: NeoVisEvents, handler: (event: any) => void): void;

    /**
     * Reset the config object and reload data
     * @param config
     */
    reinit(config: NeovisConfig): void;

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

    /**
     * create html display of the node
     * @param neo4jNode node to create html from
     * @param title_properties which properties to map
     */
    nodeToHtml(neo4jNode: Neo4j.Node, title_properties: [string]): string;
}

export default Neovis;
