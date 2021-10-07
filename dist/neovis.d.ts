import type * as Neo4jTypes from 'neo4j-driver';
import { EventFunctionTypes, NeoVisEvents } from './events';
import type * as VisNetwork from 'vis-network';
import { Cypher, Edge, NEOVIS_DEFAULT_CONFIG, NeovisConfig, Node, NonFlatNeovisConfig, NumberOrInteger } from './types';
import { Font } from 'vis-network';
export * from './events';
export * from './types';
export declare class NeoVis {
    #private;
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
     * @ignore for test purposes only
     */
    get _config(): NeovisConfig | NonFlatNeovisConfig;
    /**
     * The vis network object
     * @link https://visjs.github.io/vis-network/docs/network/#methods
     */
    get network(): VisNetwork.Network | undefined;
    /**
     *
     * @constructor
     * @param {object} config - configures the visualization and Neo4j server connection
     */
    constructor(config: NeovisConfig | NonFlatNeovisConfig);
    /**
     * Renders the network
     */
    render(query?: Cypher): void;
    /**
     * Clear the data for the visualization
     */
    clearNetwork(): void;
    /**
     *
     * @param {string} eventType Event type to be handled
     * @param {Function} handler Handler to manage the event
     */
    registerOnEvent<T extends NeoVisEvents>(eventType: T, handler: EventFunctionTypes[T]): void;
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
/**
 * create html display of the node
 * @param neo4jObject node to create html from
 * @param titleProperties which properties to map
 */
export declare function objectToTitleHtml(neo4jObject: Neo4jTypes.Node<NumberOrInteger> | Neo4jTypes.Relationship<NumberOrInteger>, titleProperties: string[]): HTMLDivElement;
/**
 * create string display of the node
 * @param neo4jObject node to create title string from
 * @param titleProperties which properties to map
 */
export declare function objectToTitleString(neo4jObject: Neo4jTypes.Node<NumberOrInteger> | Neo4jTypes.Relationship<NumberOrInteger>, titleProperties: string[]): string;
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
        [label: string]: OldLabelConfig;
        [NEOVIS_DEFAULT_CONFIG]?: OldLabelConfig;
    };
    relationships?: {
        [relationship: string]: OldRelationshipConfig;
        [NEOVIS_DEFAULT_CONFIG]?: OldRelationshipConfig;
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
export declare function migrateFromOldConfig(oldNeoVisConfig: OldNeoVisConfig): NeovisConfig;
export default NeoVis;
