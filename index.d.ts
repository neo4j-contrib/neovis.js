import * as VisNetwork from "vis-network";
import * as Neo4j from "neo4j-driver";

export const NEOVIS_DEFAULT_CONFIG: unique symbol;
export const NEOVIS_ADVANCED_CONFIG: unique symbol;


export declare class NeoVis {
    constructor(config: NeovisConfig | NonFlatNeovisConfig);

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

export default NeoVis;

/**
 * create html display of the node
 * @param neo4jNode node to create html from
 * @param title_properties which properties to map
 */
export function objectToTitleHtml(neo4jNode: Neo4j.Node, title_properties: [string]): HTMLDivElement;

/**
 * create string display of the node
 * @param neo4jNode node to create title string from
 * @param title_properties which properties to map
 */
export function objectToTitleString(neo4jNode: Neo4j.Node, title_properties: [string]): string;



export function migrateFromOldConfig(oldNeoVisConfig: OldNeoVisConfig): NeovisConfig;