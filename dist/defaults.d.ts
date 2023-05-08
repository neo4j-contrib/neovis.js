declare const defaults: {
    neo4j: {
        initialQuery: string;
        neo4jUri: string;
        neo4jUser: string;
        neo4jPassword: string;
        driverConfig: {
            encrypted: string;
            trust: string;
            maxConnectionPoolSize: number;
            connectionAcquisitionTimeout: number;
            disableLosslessIntegers: boolean;
        };
        groupAsLabel: boolean;
    };
    visJs: {
        nodes: {
            font: {
                size: number;
                strokeWidth: number;
            };
            scaling: {};
        };
        edges: {
            arrows: {
                to: {
                    enabled: boolean;
                };
            };
            length: number;
        };
        layout: {
            improvedLayout: boolean;
            hierarchical: {
                enabled: boolean;
                sortMethod: string;
            };
        };
        physics: {
            adaptiveTimestep: boolean;
            stabilization: {
                iterations: number;
                fit: boolean;
            };
        };
    };
};
export { defaults };
