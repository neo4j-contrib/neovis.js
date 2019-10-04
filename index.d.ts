interface INeovisConfig {
    container_id: string;
    server_url: string;
    server_user: string;
    server_password: string;
    labels?: {
        [label: string]: {
            caption?: string;
            size?: string;
            community?: string;
            sizeCypher?: string;
        }
    };
    relationships?: {
        [relationship: string]: {
            thickness?: string;
            caption?: boolean;
        }
    };
    arrows?: boolean;
    hierarchical? :boolean;
    hierarchical_sort_method?: "hubsize" | "directed";
    initial_cypher?: string;
    console_debug?: boolean;
    encrypted?: "ENCRYPTION_OFF" | "ENCRYPTION_ON";
    trust?: "TRUST_ALL_CERTIFICATES" | "TRUST_SYSTEM_CA_SIGNED_CERTIFICATES";
}

declare class Neovis {
    constructor(config: INeovisConfig);
    render(): void;
    clearNetwork(): void;
    registerOnEvent(eventType:string, handler: (event: any) => void);
    reinit(config: INeovisConfig): void;
    reload(): void;
    stabilize(): void;
    renderWithCypher(query: string): void;
}

export default Neovis;