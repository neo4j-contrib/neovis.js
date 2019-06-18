import * as neo4j from "neo4j-driver";
import { EncryptionLevel, Node, Path, Relationship, TrustStrategy } from "neo4j-driver/types/v1";
import * as vis from "vis";
import "../node_modules/vis/dist/vis-network.min.css";
import { NeoVisDefault as defaults } from "./defaults";
import { CompletionEvent, EdgeSelectionEvent, EventController, NodeSelectionEvent } from "./events";

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

    node?: NodeProp;
    relationship?: RelationshipProp;

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
    private _config: NeoVisConfig;
    private _encrypted: boolean | EncryptionLevel;
    private _trust: TrustStrategy;
    private _driver: neo4j.v1.Driver;
    private _query: string;
    private _nodes: Map<vis.IdType, vis.Node>;
    private _edges: Map<vis.IdType, vis.Edge>;
    private _data: DataMap;
    private _network: vis.Network;
    private _container: HTMLElement;
    private _events: EventController;

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

    constructor(config: NeoVisConfig) {
        console.log(config);
        console.log(defaults);

        this._config = config;
        this._encrypted = config.encrypted || "ENCRYPTION_OFF";
        this._trust = config.trust || "TRUST_ALL_CERTIFICATES";
        this._driver = neo4j.v1.driver(config.server_url || defaults.neo4j.neo4jUri, neo4j.v1.auth.basic(config.server_user || defaults.neo4j.neo4jUser, config.server_password || defaults.neo4j.neo4jPassword), { encrypted: this._encrypted, trust: this._trust });
        this._query = config.initial_cypher || defaults.neo4j.initialQuery;
        this._nodes = new Map<vis.IdType, vis.Node>();
        this._edges = new Map<vis.IdType, vis.Edge>();
        this._data = {};
        this._network = null;
        this._container = document.getElementById(config.container_id);

        this._events = new EventController();
    }

    public _addNode(node: vis.Node) {
        this._nodes.set(node.id, node);
    }

    public _addEdge(edge: vis.Edge) {
        this._edges.set(edge.id, edge);
    }

    /**
     * Build node object for vis from a neo4j Node
     * FIXME: use config
     * FIXME: move to private api
     * @param {Node} n
     * @returns {vis.Node}
     */
    public buildNodeVisObject(n: Node): vis.Node {

        const self = this;
        const node: vis.Node = {};
        const label = n.labels[0];

        const captionKey = this._config && this._config.node && this._config.node.caption,
            sizeKey = this._config && this._config.node && this._config.node.size,
            sizeCypher = this._config && this._config.node && this._config.node.sizeCypher,
            communityKey = this._config && this._config.node && this._config.node.community;

        node.id = n.identity.toInt();

        // node size

        if (sizeCypher) {
            // use a cypher statement to determine the size of the node
            // the cypher statement will be passed a parameter {id} with the value
            // of the internal node id

            const session = this._driver.session();
            session.run(sizeCypher, { id: neo4j.v1.int(node.id) })
                .then(function(result) {
                    result.records.forEach(function(record) {
                        record.forEach(function(v, k, r) {
                            if (typeof v === "number") {
                                self._addNode({ id: node.id, value: v });
                            } else if (v.constructor.name === "Integer") {
                                self._addNode({ id: node.id, value: v.toNumber() });
                            }
                        });
                    });
                });

        } else if (typeof sizeKey === "number") {
            node.value = sizeKey;
        } else {

            const sizeProp = self.getProperty(n.properties, sizeKey);

            if (sizeProp && typeof sizeProp === "number") {
                // propety value is a number, OK to use
                node.value = sizeProp;
            } else if (sizeProp && typeof sizeProp === "object" && sizeProp.constructor.name === "Integer") {
                // property value might be a Neo4j Integer, check if we can call toNumber on it:
                if (sizeProp.inSafeRange()) {
                    node.value = sizeProp.toNumber();
                } else {
                    // couldn't convert to Number, use default
                    node.value = 1.0;
                }
            } else {
                node.value = 1.0;
            }
        }

        // node caption
        if (typeof captionKey === "function") {
            node.label = captionKey(n);
        } else {
            node.label = self.getProperty(n.properties, captionKey) || label || "";
        }

        // community
        // behavior: color by value of community property (if set in config), then color by label
        if (!communityKey) {
            node.group = label;
        } else {
            try {
                const communityProp = self.getProperty(n.properties, communityKey);
                if (communityProp) {
                    node.group = communityProp.toNumber() || label || 0;  // FIXME: cast to Integer

                } else {
                    node.group = "0";
                }

            } catch (e) {
                node.group = "0";
            }

        }

        // set all properties as tooltip
        node.title = "";
        for (const key in n.properties) {
            node.title += "<strong>" + key + ":</strong>" + " " + this.getProperty(n.properties, key) + "<br>";
        }
        return node;
    }

    /**
     * Build edge object for vis from a neo4j Relationship
     * @param {Relationship} r
     * @returns {vis.Edge}
     */
    public buildEdgeVisObject(r: Relationship): vis.Edge {

        const weightKey = this._config && this._config.relationship && this._config.relationship.thickness,
            captionKey = this._config && this._config.relationship && this._config.relationship.caption;

        const edge: vis.Edge = {};
        edge.id = r.identity.toInt();
        edge.from = r.start.toInt();
        edge.to = r.end.toInt();

        // hover tooltip. show all properties in the format <strong>key:</strong> value
        edge.title = "";
        for (const key in r.properties) {
            edge.title += "<strong>" + key + ":</strong>" + " " + this.getProperty(r.properties, key) + "<br>";
        }

        // set relationship thickness
        if (weightKey && typeof weightKey === "string") {
            edge.value = this.getProperty(r.properties, weightKey);
        } else if (weightKey && typeof weightKey === "number") {
            edge.value = weightKey;
        } else {
            edge.value = 1.0;
        }

        // set caption

        if (typeof captionKey === "boolean") {
            if (!captionKey) {
                edge.label = "";
            } else {
                edge.label = r.type;
            }
        } else if (captionKey && typeof captionKey === "string") {
            edge.label = this.getProperty(r.properties, captionKey) || "";
        } else {
            edge.label = r.type;
        }

        return edge;
    }

    /**
     * Render nodes to canvas
     */
    public render() {

        // connect to Neo4j instance
        // run query

        const self = this;
        let recordCount = 0;

        const session = this._driver.session();

        session.run(this._query, { limit: 30 })
            .subscribe({
                onNext(record) {
                    recordCount++;

                    //console.log("CLASS NAME", record.constructor.name, record);

                    record.forEach(function(v, k, r) {
                        //console.log("Constructor: ", v.constructor.name);

                        switch (v.constructor.name as string) {
                            case "Node":
                                const node = self.buildNodeVisObject(v as Node);

                                try {
                                    self._addNode(node);
                                } catch (e) {
                                    console.error(e);
                                }
                                break;

                            case "Relationship":
                                const edge = self.buildEdgeVisObject(v as Relationship);
                                try {
                                    self._addEdge(edge);
                                } catch (e) {
                                    console.error(e);
                                }
                                break;

                            case "Path":
                                //console.log("PATH: ", v);
                                const value = v as Path;

                                const n1 = self.buildNodeVisObject(value.start);
                                const n2 = self.buildNodeVisObject(value.end);

                                self._addNode(n1);
                                self._addNode(n2);

                                value.segments.forEach((obj) => {
                                    self._addNode(self.buildNodeVisObject(obj.start));
                                    self._addNode(self.buildNodeVisObject(obj.end));
                                    self._addEdge(self.buildEdgeVisObject(obj.relationship));
                                });
                                break;

                            case "Array":
                                (v as Array<Node | Relationship>).forEach(function(obj: any) {
                                    //console.log("Array element constructor: ", obj.constructor.name);
                                    switch (obj.constructor.name) {
                                        case "Node":
                                            const node = self.buildNodeVisObject(obj as Node);
                                            try {
                                                self._addNode(node);
                                            } catch (e) {
                                                console.error(e);
                                            }
                                            break;

                                        case "Relationship":
                                            const edge = self.buildEdgeVisObject(obj as Relationship);

                                            try {
                                                self._addEdge(edge);
                                            } catch (e) {
                                                console.error(e);
                                            }
                                            break;

                                        default: break;
                                    }

                                });
                                break;

                            default: break;
                        }

                    });
                },
                onCompleted() {
                    session.close();
                    const options: vis.Options = {
                        interaction: {
                            hover: true,
                            hoverConnectedEdges: true,
                            selectConnectedEdges: false,
                        },
                        nodes: {
                            shape: "dot",
                            font: {
                                size: 26,
                                strokeWidth: 7
                            },
                            scaling: {
                                label: {
                                    enabled: true
                                }
                            }
                        },
                        edges: {
                            arrows: self._config.visOptions.edges.arrows || defaults.visjs.edges.arrows,
                            length: 200
                        },
                        layout: self._config.visOptions.layout || defaults.visjs.layout,
                        physics: { // TODO: adaptive physics settings based on size of graph rendered
                            // enabled: true,
                            // timestep: 0.5,
                            // stabilization: {
                            //     iterations: 10
                            // }

                            adaptiveTimestep: true,
                            barnesHut: {
                                gravitationalConstant: -8000,
                                springConstant: 0.04,
                                springLength: 95
                            },
                            stabilization: false

                        }
                    };

                    const container = self._container;
                    self._data = {
                        nodes: new vis.DataSet(Array.from(self._nodes.values())),
                        edges: new vis.DataSet(Array.from(self._edges.values()))
                    };

                    //console.log(self._data.nodes);
                    //console.log(self._data.edges);

                    // Create duplicate node for any self reference relationships
                    // NOTE: Is this only useful for data model type data
                    // self._data.edges = self._data.edges.map(
                    //     function (item) {
                    //          if (item.from == item.to) {
                    //             var newNode = self._data.nodes.get(item.from)
                    //             delete newNode.id;
                    //             var newNodeIds = self._data.nodes.add(newNode);
                    //             ////console.log("Adding new node and changing self-ref to node: " + item.to);
                    //             item.to = newNodeIds[0];
                    //          }
                    //          return item;
                    //     }
                    // );

                    self._network = new vis.Network(container, self._data, options);
                    self._network.on("selectNode", (properties) => {
                        const cypher = "MATCH (n) WHERE ID(n) IN [" + properties.nodes.join(", ") + "] RETURN n";
                        const session = self._driver.session();
                        session.run(cypher)
                            .then((results) => {
                                //console.log(cypher);
                                self._events.generateEvent(NodeSelectionEvent, results.records);
                                session.close();
                            });
                    });

                    self._network.on("selectEdge", (properties) => {
                        const cypher = "MATCH ()-[r]->() WHERE ID(r) IN [" + properties.edges.join(", ") + "] RETURN r";
                        const session = self._driver.session();
                        session.run(cypher)
                            .then((results) => {
                                //console.log(cypher);
                                self._events.generateEvent(EdgeSelectionEvent, results.records);
                                session.close();
                            });
                    });

                    //console.log("completed");
                    setTimeout(() => { self._network.stopSimulation(); }, 10000);

                    self._events.generateEvent(CompletionEvent, { record_count: recordCount });

                },
                onError(error) {
                    console.error(error);
                }

            });
    }

    /**
     * Clear the data for the visualization
     */
    public clearNetwork() {
        this._nodes.clear();
        this._edges.clear();
        this._network.setData({});
    }

    /**
     * Register an event on the network
     * @param {string} eventType Event type to be handled
     * @param {Function} handler Handler to manage the event
     */
    public registerOnEvent(eventType: string, handler: (args: any[]) => void) {
        this._events.register(eventType, handler);
    }

    /**
     * Reset the config object and reload data
     * @param {NeoVisConfig} config
     */
    public reinit(config: NeoVisConfig) {

    }

    /**
     * Fetch live data form the server and reload the visualization
     */
    public reload() {

        this.clearNetwork();
        this.render();

    }

    /**
     * Stabilize the visuzliation
     */
    public stabilize() {
        this._network.stopSimulation();
        console.log("Calling stopSimulation");
    }

    /**
     * Execute an arbitrary Cypher query and re-render the visualization
     * @param {string} query
     */
    public renderWithCypher(query: string) {

        // self._config.initial_cypher = query;

        this.clearNetwork();
        this._query = query;
        this.render();

    }

    /**
     * Focus on certain node via cypher search
     * @param {string} nodePK primary key of the model or search attribute
     * @param {string} nodePKVal search value
     * @param {object} options https://visjs.org/docs/network/
     */
    public focusOnNode(nodePK: string, nodePKVal: string, options: object) {
        const self = this;
        const cypher = "MATCH (n) WHERE n." + nodePK + " = '" + nodePKVal + "' RETURN ID(n) as nodeID LIMIT 1";
        const session = this._driver.session();

        session.run(cypher)
            .then((result) => {
                console.log(cypher, result.records);
                const nodeID = result.records[0].get("nodeID");
                self._network.focus(nodeID, options);
                self._network.selectNodes([nodeID]);
                session.close();
            })
            .catch((reason) => { console.log(reason); });
    }

    /**
     * Get property value from a Neo4J entity
     * @param properties properties
     * @param key key
     */
    private getProperty(properties: object, key: any): any {
        const map = new Map(Object.entries(properties));
        return map.get(key);
    }

    // configure exports based on environment (ie Node.js or browser)
    // if (typeof exports === 'object') {
    //    module.exports = NeoVis;
    // } else {
    //    define (function () {return NeoVis;})
    // }

}

export { NeoVis };
