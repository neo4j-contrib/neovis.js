import * as VisNetwork from "vis-network";
import * as Neo4j from "neo4j-driver";

export const NEOVIS_DEFAULT_CONFIG: unique symbol;
export const NEOVIS_ADVANCED_CONFIG: unique symbol;

export type RecursiveMapTo<T, New> = {
    [P in keyof T]: T[P] extends object ? RecursiveMapTo<T[P], New> : New
};

export type RecursiveMapToFunction<T, NEO_TYPE> = {
    [P in keyof T]: T[P] extends object ? ((node: NEO_TYPE) => T[P]) | (RecursiveMapToFunction<T[P], NEO_TYPE>) : (node: NEO_TYPE) => T[P]
};

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

export interface LabelConfig extends RecursiveMapTo<VisNetwork.Node, string> {
    [NEOVIS_ADVANCED_CONFIG]?: NeoVisAdvanceConfig<VisNetwork.Node, Neo4j.Node<number>>;
}

export interface RelationshipConfig extends RecursiveMapTo<VisNetwork.Edge, string>{
    [NEOVIS_ADVANCED_CONFIG]?: NeoVisAdvanceConfig<VisNetwork.Edge, Neo4j.Relationship<number>>;
}

export interface NeovisConfig {
    container_id: string;
    server_database: string;
    neo4j: Neo4j.Driver | {
        server_url: string;
        server_user: string;
        server_password: string;
        encrypted?: "ENCRYPTION_OFF" | "ENCRYPTION_ON";
        trust?: "TRUST_ALL_CERTIFICATES" | "TRUST_SYSTEM_CA_SIGNED_CERTIFICATES";
    };
    visConfig: VisNetwork.Options;
    labels?: {
        [label: string]: LabelConfig,
        [NEOVIS_DEFAULT_CONFIG]?: LabelConfig
    };
    relationships?: {
        [relationship: string]: RelationshipConfig,
        [NEOVIS_DEFAULT_CONFIG]?: RelationshipConfig
    };
    initial_cypher?: Cypher;
    console_debug?: boolean;
}

export interface Node extends VisNetwork.Node {
    raw: Neo4j.Node
}

export interface Edge extends VisNetwork.Edge {
    raw: Neo4j.Relationship
}

declare class Neovis {
    constructor(config: NeovisConfig);
    get nodes(): VisNetwork.DataSet<Node>;
    get edges(): VisNetwork.DataSet<Edge>;
    get network(): VisNetwork.Network | undefined;
    render(): void;
    clearNetwork(): void;
    registerOnEvent(eventType: string, handler: (event: any) => void): void;
    reinit(config: NeovisConfig): void;
    reload(): void;
    stabilize(): void;
    renderWithCypher(query: Cypher): void;
    updateWithCypher(query: Cypher): void;
    nodeToHtml(neo4jNode: Neo4j.Node, title_properties: [string]): string;
}

export default Neovis;
