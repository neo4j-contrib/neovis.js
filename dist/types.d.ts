import type * as Neo4jTypes from 'neo4j-driver';
import type * as VisNetwork from 'vis-network';
export declare const NEOVIS_DEFAULT_CONFIG: unique symbol;
export declare const NEOVIS_ADVANCED_CONFIG: unique symbol;
export type NumberOrInteger = number | Neo4jTypes.Integer;
export type RecursiveMapToDist<T, New> = T extends object ? RecursiveMapTo<T, New> : New;
export type DataFunctionType = (any?: unknown) => AsyncIterable<Neo4jTypes.Record> | Promise<Iterable<Neo4jTypes.Record>> | Iterable<Neo4jTypes.Record>;
/**
 * Maps a type recursively and replace each non object type with the new type
 * @param <T> type to map
 * @param <New> type to map to for each non object type
 */
export type RecursiveMapTo<T, New> = {
    [P in keyof T]: RecursiveMapToDist<T[P], New>;
};
export type RecursiveMapToFunctionDist<T, PARAM_TYPE> = T extends object ? ((param: PARAM_TYPE) => T) | (RecursiveMapToFunction<T, PARAM_TYPE>) : (param: PARAM_TYPE) => T;
/**
 * Maps a type recursively and adds the ability for each object property to be a function that returns the same type
 * but replace each non object type with a function that returns the same type
 * @param <T> type to map
 * @param <PARAM_TYPE> type of parameter the functions get
 */
export type RecursiveMapToFunction<T, PARAM_TYPE> = {
    [P in keyof T]: RecursiveMapToFunctionDist<T[P], PARAM_TYPE>;
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
export type NeovisDataConfig<VIS_TYPE, NEO_TYPE> = RecursiveMapTo<VIS_TYPE, string> & {
    [NEOVIS_ADVANCED_CONFIG]?: NeoVisAdvanceConfig<VIS_TYPE, NEO_TYPE>;
};
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
    serverUrl?: string;
    serverUser?: string;
    serverPassword?: string;
    /**
     * @link https://neo4j.com/docs/api/javascript-driver/current/function/index.html#configuration
     */
    driverConfig?: Neo4jTypes.Config;
}
export interface BaseNeovisConfig {
    /**
     * Html id of the element you want Neovis to render on
     */
    containerId: string;
    /**
     * database name you want to connect to
     * @default neo4j
     */
    serverDatabase?: string;
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
     * function to get fetch data instead of neo4j driver
     *
     * it needs to return a list of records
     *
     * example in examples/simple-dataFunction-example.html
     */
    dataFunction?: DataFunctionType;
    /**
     * The Cypher query that will get the data
     */
    initialCypher?: Cypher;
    /**
     * Should output debug messages to console
     * @default false
     */
    consoleDebug?: boolean;
    /**
     * Should group be the label
     * @default true
     */
    groupAsLabel?: boolean;
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
 *      containerId: "viz",
 *      neo4j: {
 *      	serverUrl: "bolt://localhost:7687",
 *      	serverUser: "neo4j",
 *      	serverPassword: "sorts-swims-burglaries"
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
 *      initialCypher: "MATCH (n)-[r:INTERACTS]->(m) RETURN n,r,m"
 * }
 * // advance
 * {
 *      containerId: 'viz',
 *      neo4j: {
 *      	serverUrl: 'bolt://localhost:7687',
 *      	serverUser: 'neo4j',
 *      	serverPassword: 'gland-presentation-worry'
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
 *      initialCypher: 'MATCH (n)-[r]->(m) RETURN n,r,m'
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
export type NonFlatLabelConfig = NonFlatNeoVisAdvanceConfig<VisNetwork.Node, Neo4jTypes.Node<number>>;
export type NonFlatRelationsipConfig = NonFlatNeoVisAdvanceConfig<VisNetwork.Edge, Neo4jTypes.Relationship<number>>;
/**
 * non flat version of the configuration (without Symbols)
 * look at the normal config for more information
 *
 * @example
 * ```js
 * {
 *      containerId: 'viz',
 *      nonFlat: true,
 *      neo4j: {
 *      	serverUrl: 'bolt://localhost:7687',
 *      	serverUser: 'neo4j',
 *      	serverPassword: 'gland-presentation-worry'
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
 *      initialCypher: 'MATCH (n)-[r]->(m) RETURN n,r,m'
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
    raw: Neo4jTypes.Node<NumberOrInteger>;
}
/**
 * A network edge with raw neo4j relationship
 */
export interface Edge extends VisNetwork.Edge {
    /**
     * https://neo4j.com/docs/api/javascript-driver/current/class/src/graph-types.js~Relationship.html
     */
    id: number | string;
    raw: Neo4jTypes.Relationship<NumberOrInteger>;
}
