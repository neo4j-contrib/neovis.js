"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var neo4j = __importStar(require("neo4j-driver"));
var vis = __importStar(require("vis"));
require("../node_modules/vis/dist/vis-network.min.css");
var defaults_1 = require("./defaults");
var events_1 = require("./events");
var NeoVis = /** @class */ (function () {
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
    function NeoVis(config) {
        console.log(config);
        console.log(defaults_1.NeoVisDefault);
        this._config = config;
        this._encrypted = config.encrypted || "ENCRYPTION_OFF";
        this._trust = config.trust || "TRUST_ALL_CERTIFICATES";
        this._driver = neo4j.v1.driver(config.server_url || defaults_1.NeoVisDefault.neo4j.neo4jUri, neo4j.v1.auth.basic(config.server_user || defaults_1.NeoVisDefault.neo4j.neo4jUser, config.server_password || defaults_1.NeoVisDefault.neo4j.neo4jPassword), { encrypted: this._encrypted, trust: this._trust });
        this._query = config.initial_cypher || defaults_1.NeoVisDefault.neo4j.initialQuery;
        this._nodes = new Map();
        this._edges = new Map();
        this._data = {};
        this._network = null;
        this._container = document.getElementById(config.container_id);
        this._events = new events_1.EventController();
    }
    NeoVis.prototype._addNode = function (node) {
        this._nodes.set(node.id, node);
    };
    NeoVis.prototype._addEdge = function (edge) {
        this._edges.set(edge.id, edge);
    };
    /**
     * Build node object for vis from a neo4j Node
     * FIXME: use config
     * FIXME: move to private api
     * @param {Node} n
     * @returns {vis.Node}
     */
    NeoVis.prototype.buildNodeVisObject = function (n) {
        var self = this;
        var node = {};
        var label = n.labels[0];
        var captionKey = this._config && this._config.nodes && this._config.nodes[label] && this._config.nodes[label].caption, sizeKey = this._config && this._config.nodes && this._config.nodes[label] && this._config.nodes[label].size, sizeCypher = this._config && this._config.nodes && this._config.nodes[label] && this._config.nodes[label].sizeCypher, communityKey = this._config && this._config.nodes && this._config.nodes[label] && this._config.nodes[label].community;
        node.id = n.identity.toInt();
        // node size
        if (sizeCypher) {
            // use a cypher statement to determine the size of the node
            // the cypher statement will be passed a parameter {id} with the value
            // of the internal node id
            var session = this._driver.session();
            session.run(sizeCypher, { id: neo4j.v1.int(node.id) })
                .then(function (result) {
                result.records.forEach(function (record) {
                    record.forEach(function (v, k, r) {
                        if (typeof v === "number") {
                            self._addNode({ id: node.id, value: v });
                        }
                        else if (v.constructor.name === "Integer") {
                            self._addNode({ id: node.id, value: v.toNumber() });
                        }
                    });
                });
            });
        }
        else if (typeof sizeKey === "number") {
            node.value = sizeKey;
        }
        else {
            var sizeProp = self.getProperty(n.properties, sizeKey);
            if (sizeProp && typeof sizeProp === "number") {
                // propety value is a number, OK to use
                node.value = sizeProp;
            }
            else if (sizeProp && typeof sizeProp === "object" && sizeProp.constructor.name === "Integer") {
                // property value might be a Neo4j Integer, check if we can call toNumber on it:
                if (sizeProp.inSafeRange()) {
                    node.value = sizeProp.toNumber();
                }
                else {
                    // couldn't convert to Number, use default
                    node.value = 1.0;
                }
            }
            else {
                node.value = 1.0;
            }
        }
        // node caption
        if (typeof captionKey === "function") {
            node.label = captionKey(n);
        }
        else {
            node.label = self.getProperty(n.properties, captionKey) || label || "";
        }
        // community
        // behavior: color by value of community property (if set in config), then color by label
        if (!communityKey) {
            node.group = label;
        }
        else {
            try {
                var communityProp = self.getProperty(n.properties, communityKey);
                if (communityProp) {
                    node.group = communityProp.toNumber() || label || 0; // FIXME: cast to Integer
                }
                else {
                    node.group = "0";
                }
            }
            catch (e) {
                node.group = "0";
            }
        }
        // set all properties as tooltip
        node.title = "";
        for (var key in n.properties) {
            node.title += "<strong>" + key + ":</strong>" + " " + this.getProperty(n.properties, key) + "<br>";
        }
        return node;
    };
    /**
     * Build edge object for vis from a neo4j Relationship
     * @param {Relationship} r
     * @returns {vis.Edge}
     */
    NeoVis.prototype.buildEdgeVisObject = function (r) {
        var weightKey = this._config && this._config.relationships && this._config.relationships[r.type] && this._config.relationships[r.type].thickness, captionKey = this._config && this._config.relationships && this._config.relationships[r.type] && this._config.relationships[r.type].caption;
        var edge = {};
        edge.id = r.identity.toInt();
        edge.from = r.start.toInt();
        edge.to = r.end.toInt();
        // hover tooltip. show all properties in the format <strong>key:</strong> value
        edge.title = "";
        for (var key in r.properties) {
            edge.title += "<strong>" + key + ":</strong>" + " " + this.getProperty(r.properties, key) + "<br>";
        }
        // set relationship thickness
        if (weightKey && typeof weightKey === "string") {
            edge.value = this.getProperty(r.properties, weightKey);
        }
        else if (weightKey && typeof weightKey === "number") {
            edge.value = weightKey;
        }
        else {
            edge.value = 1.0;
        }
        // set caption
        if (typeof captionKey === "boolean") {
            if (!captionKey) {
                edge.label = "";
            }
            else {
                edge.label = r.type;
            }
        }
        else if (captionKey && typeof captionKey === "string") {
            edge.label = this.getProperty(r.properties, captionKey) || "";
        }
        else {
            edge.label = r.type;
        }
        return edge;
    };
    // public API
    NeoVis.prototype.render = function () {
        // connect to Neo4j instance
        // run query
        var self = this;
        var recordCount = 0;
        var session = this._driver.session();
        session
            .run(this._query, { limit: 30 })
            .subscribe({
            onNext: function (record) {
                recordCount++;
                // console.log("CLASS NAME");
                // console.log(record.constructor.name);
                // console.log(record);
                record.forEach(function (v, k, r) {
                    // console.log("Constructor:");
                    // console.log(v.constructor.name);
                    if (v.constructor.name === "Node") {
                        var node = self.buildNodeVisObject(v);
                        try {
                            self._addNode(node);
                        }
                        catch (e) {
                            console.error(e);
                        }
                    }
                    else if (v.constructor.name === "Relationship") {
                        var edge = self.buildEdgeVisObject(v);
                        try {
                            self._addEdge(edge);
                        }
                        catch (e) {
                            console.error(e);
                        }
                    }
                    else if (v.constructor.name === "Path") {
                        // console.log("PATH");
                        // console.log(v);
                        var n1 = self.buildNodeVisObject(v.start);
                        var n2 = self.buildNodeVisObject(v.end);
                        self._addNode(n1);
                        self._addNode(n2);
                        v.segments.forEach(function (obj) {
                            self._addNode(self.buildNodeVisObject(obj.start));
                            self._addNode(self.buildNodeVisObject(obj.end));
                            self._addEdge(self.buildEdgeVisObject(obj.relationship));
                        });
                    }
                    else if (v.constructor.name === "Array") {
                        v.forEach(function (obj) {
                            // console.log("Array element constructor:");
                            // console.log(obj.constructor.name);
                            if (obj.constructor.name === "Node") {
                                var node = self.buildNodeVisObject(obj);
                                try {
                                    self._addNode(node);
                                }
                                catch (e) {
                                    console.error(e);
                                }
                            }
                            else if (obj.constructor.name === "Relationship") {
                                var edge = self.buildEdgeVisObject(obj);
                                try {
                                    self._addEdge(edge);
                                }
                                catch (e) {
                                    console.error(e);
                                }
                            }
                        });
                    }
                });
            },
            onCompleted: function () {
                session.close();
                var options = {
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
                        arrows: self._config.visOptions.edges.arrows || defaults_1.NeoVisDefault.visjs.edges.arrows,
                        length: 200
                    },
                    layout: self._config.visOptions.layout,
                    physics: {
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
                var container = self._container;
                self._data = {
                    nodes: new vis.DataSet(Object.keys(self._nodes).map(function (key) { return self._nodes.get(key); })),
                    edges: new vis.DataSet(Object.keys(self._edges).map(function (key) { return self._edges.get(key); }))
                };
                // console.log(self._data.nodes);
                // console.log(self._data.edges);
                // Create duplicate node for any self reference relationships
                // NOTE: Is this only useful for data model type data
                // self._data.edges = self._data.edges.map(
                //     function (item) {
                //          if (item.from == item.to) {
                //             var newNode = self._data.nodes.get(item.from)
                //             delete newNode.id;
                //             var newNodeIds = self._data.nodes.add(newNode);
                //             //console.log("Adding new node and changing self-ref to node: " + item.to);
                //             item.to = newNodeIds[0];
                //          }
                //          return item;
                //     }
                // );
                self._network = new vis.Network(container, self._data, options);
                self._network.on("selectNode", function (properties) {
                    var cypher = "MATCH (n) WHERE ID(n) IN [" + properties.nodes.join(", ") + "] RETURN n";
                    var session = self._driver.session();
                    session.run(cypher)
                        .then(function (results) {
                        // console.log(cypher);
                        self._events.generateEvent(events_1.NodeSelectionEvent, results.records);
                        session.close();
                    });
                });
                self._network.on("selectEdge", function (properties) {
                    var cypher = "MATCH ()-[r:TRANSFER]->() WHERE ID(r) IN [" + properties.edges.join(", ") + "] RETURN r";
                    var session = self._driver.session();
                    session.run(cypher)
                        .then(function (results) {
                        // console.log(cypher);
                        self._events.generateEvent(events_1.EdgeSelectionEvent, results.records);
                        session.close();
                    });
                });
                // console.log("completed");
                setTimeout(function () { self._network.stopSimulation(); }, 10000);
                self._events.generateEvent(events_1.CompletionEvent, { record_count: recordCount });
            },
            onError: function (error) {
                console.error(error);
            }
        });
    };
    /**
     * Clear the data for the visualization
     */
    NeoVis.prototype.clearNetwork = function () {
        this._nodes.clear();
        this._edges.clear();
        this._network.setData({});
    };
    /**
     * Register an event on the network
     * @param {string} eventType Event type to be handled
     * @param {Function} handler Handler to manage the event
     */
    NeoVis.prototype.registerOnEvent = function (eventType, handler) {
        this._events.register(eventType, handler);
    };
    /**
     * Reset the config object and reload data
     * @param {NeoVisConfig} config
     */
    NeoVis.prototype.reinit = function (config) {
    };
    /**
     * Fetch live data form the server and reload the visualization
     */
    NeoVis.prototype.reload = function () {
        this.clearNetwork();
        this.render();
    };
    /**
     * Stabilize the visuzliation
     */
    NeoVis.prototype.stabilize = function () {
        this._network.stopSimulation();
        console.log("Calling stopSimulation");
    };
    /**
     * Execute an arbitrary Cypher query and re-render the visualization
     * @param {string} query
     */
    NeoVis.prototype.renderWithCypher = function (query) {
        // self._config.initial_cypher = query;
        this.clearNetwork();
        this._query = query;
        this.render();
    };
    /**
     * Focus on certain node via cypher search
     * @param {string} nodePK primary key of the model or search attribute
     * @param {string} nodePKVal search value
     * @param {object} options https://visjs.org/docs/network/
     */
    NeoVis.prototype.focusOnNode = function (nodePK, nodePKVal, options) {
        var self = this;
        var cypher = "MATCH (n) WHERE n." + nodePK + " = '" + nodePKVal + "' RETURN ID(n) as nodeID LIMIT 1";
        var session = this._driver.session();
        session.run(cypher)
            .then(function (result) {
            console.log(cypher, result.records);
            var nodeID = result.records[0].get("nodeID");
            self._network.focus(nodeID, options);
            self._network.selectNodes([nodeID]);
            session.close();
        })
            .catch(function (reason) { console.log(reason); });
    };
    /**
     * Get property value from a Neo4J entity
     * @param properties properties
     * @param key key
     */
    NeoVis.prototype.getProperty = function (properties, key) {
        var map = new Map(Object.entries(properties));
        return map.get(key);
    };
    return NeoVis;
}());
exports.NeoVis = NeoVis;
exports.default = NeoVis;
