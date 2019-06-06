import { EncryptionLevel, Node, Relationship, TrustStrategy } from "neo4j-driver/types/v1";
import * as vis from "vis";
import "../node_modules/vis/dist/vis-network.min.css";
export interface DataMap {
    nodes?: vis.DataSet<vis.Node>;
    edges?: vis.DataSet<vis.Edge>;
}
export interface NeoVisConfig {
    container_id: string;
    server_url: string;
    server_user: string;
    server_password: string;
    initial_cypher: string;
    nodes?: {
        [nodeLabel: string]: NodeProp;
    };
    relationships?: {
        [relationshipLabel: string]: RelationshipProp;
    };
    visOptions?: vis.Options;
    encrypted?: boolean | EncryptionLevel;
    trust?: TrustStrategy;
}
export interface NodeProp {
    size?: any;
    community?: any;
    caption?: any;
    sizeCypher?: string;
}
export interface RelationshipProp {
    thickness?: any;
    caption?: any;
}
export default class NeoVis {
    private _config;
    private _encrypted;
    private _trust;
    private _driver;
    private _query;
    private _nodes;
    private _edges;
    private _data;
    private _network;
    private _container;
    private _events;
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
    constructor(config: NeoVisConfig);
    _addNode(node: vis.Node): void;
    _addEdge(edge: vis.Edge): void;
    /**
     * Build node object for vis from a neo4j Node
     * FIXME: use config
     * FIXME: move to private api
     * @param {Node} n
     * @returns {vis.Node}
     */
    buildNodeVisObject(n: Node): vis.Node;
    /**
     * Build edge object for vis from a neo4j Relationship
     * @param {Relationship} r
     * @returns {vis.Edge}
     */
    buildEdgeVisObject(r: Relationship): vis.Edge;
    render(): void;
    /**
     * Clear the data for the visualization
     */
    clearNetwork(): void;
    /**
     * Register an event on the network
     * @param {string} eventType Event type to be handled
     * @param {Function} handler Handler to manage the event
     */
    registerOnEvent(eventType: string, handler: (args: any[]) => void): void;
    /**
     * Reset the config object and reload data
     * @param {NeoVisConfig} config
     */
    reinit(config: NeoVisConfig): void;
    /**
     * Fetch live data form the server and reload the visualization
     */
    reload(): void;
    /**
     * Stabilize the visuzliation
     */
    stabilize(): void;
    /**
     * Execute an arbitrary Cypher query and re-render the visualization
     * @param {string} query
     */
    renderWithCypher(query: string): void;
    /**
     * Focus on certain node via cypher search
     * @param {string} nodePK primary key of the model or search attribute
     * @param {string} nodePKVal search value
     * @param {object} options https://visjs.org/docs/network/
     */
    focusOnNode(nodePK: string, nodePKVal: string, options: object): void;
    /**
     * Get property value from a Neo4J entity
     * @param properties properties
     * @param key key
     */
    private getProperty;
}
export { NeoVis };
