export declare const NeoVisDefault: {
    neo4j: {
        initialQuery: string;
        neo4jUri: string;
        neo4jUser: string;
        neo4jPassword: string;
        encrypted: string;
        trust: string;
    };
    visjs: {
        interaction: {
            hover: boolean;
            hoverConnectedEdges: boolean;
            selectConnectedEdges: boolean;
            multiselect: string;
            zoomView: boolean;
            experimental: {};
        };
        physics: {
            barnesHut: {
                damping: number;
            };
        };
        nodes: {
            mass: number;
            shape: string;
            labelHighlightBold: boolean;
            widthConstraint: {
                maximum: number;
            };
            heightConstraint: {
                maximum: number;
            };
        };
        edges: {
            hoverWidth: number;
            selectionWidth: number;
            smooth: {
                type: string;
                roundness: number;
            };
            font: {
                size: number;
                strokeWidth: number;
                align: string;
            };
            color: {
                inherit: boolean;
            };
            arrows: {
                to: {
                    enabled: boolean;
                    type: string;
                    scaleFactor: number;
                };
            };
        };
    };
};
