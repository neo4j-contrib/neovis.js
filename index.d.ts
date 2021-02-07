import {Node as VisNode, Edge as VisEdge, Options as visNetworkOptions, DataSet, Network} from "vis-network";
import { Node as Neo4jNode, Relationship as Neo4jRelationship, Driver as Neo4jDriver } from "neo4j-driver";

export const NEOVIS_DEFAULT_CONFIG: unique symbol;
export const NEOVIS_ADVANCED_CONFIG: unique symbol;

type RecursiveMapTo<T, New> = {
    [P in keyof T]: T[P] extends object ? RecursiveMapTo<T[P], New> : New
};

type RecursiveMapToFunction<T, NEO_TYPE> = {
    [P in keyof T]: T[P] extends object ? ((node: NEO_TYPE) => T[P]) | (RecursiveMapToFunction<T[P], NEO_TYPE>) : (node: NEO_TYPE) => T[P]
};

type Cypher = string;

interface INeoVisAdvanceConfig<VIS_TYPE, NEO_TYPE> {
    static?: VIS_TYPE;
    cypher?: RecursiveMapTo<VIS_TYPE, Cypher>;
    function?: RecursiveMapToFunction<VIS_TYPE, NEO_TYPE>;
}

export interface ILabelConfig extends RecursiveMapTo<VisNode, string> {
    [NEOVIS_ADVANCED_CONFIG]?: INeoVisAdvanceConfig<VisNode, Neo4jNode<number>>;
}

export interface IRelationshipConfig extends RecursiveMapTo<VisEdge, string>{
    [NEOVIS_ADVANCED_CONFIG]?: INeoVisAdvanceConfig<VisEdge, Neo4jRelationship<number>>;
}

export interface INeovisConfig {
    container_id: string;
    server_database: string;
    neo4j: Neo4jDriver | {
        server_url: string;
        server_user: string;
        server_password: string;
        encrypted?: "ENCRYPTION_OFF" | "ENCRYPTION_ON";
        trust?: "TRUST_ALL_CERTIFICATES" | "TRUST_SYSTEM_CA_SIGNED_CERTIFICATES";
    };
    visConfig: visNetworkOptions;
    labels?: {
        [label: string]: ILabelConfig,
        [NEOVIS_DEFAULT_CONFIG]?: IRelationshipConfig
    };
    relationships?: {
        [relationship: string]: IRelationshipConfig,
        [NEOVIS_DEFAULT_CONFIG]?: IRelationshipConfig
    };
    initial_cypher?: string;
    console_debug?: boolean;
}

export interface INode extends VisNode {
    raw: Neo4jNode
}

export interface IEdge extends VisEdge {
    raw: Neo4jRelationship
}

declare class Neovis {
    constructor(config: INeovisConfig);
    get nodes(): DataSet<INode>;
    get edges(): DataSet<IEdge>;
    get network(): Network;
    render(): void;
    clearNetwork(): void;
    registerOnEvent(eventType: string, handler: (event: any) => void): void;
    reinit(config: INeovisConfig): void;
    reload(): void;
    stabilize(): void;
    renderWithCypher(query: string): void;
    updateWithCypher(query: string): void;
    nodeToHtml(neo4jNode: Neo4jNode, title_properties: [string]): string;
}

export default Neovis;
