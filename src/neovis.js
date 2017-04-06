'use strict';

import * as neo4j from '../vendor/neo4j-web.js';
import * as vis from '../vendor/vis.min.js';
import '../vendor/vis/vis-network.min.css';


var defaultQuery =  "MATCH (n) WHERE exists(n.betweenness)\n" +
                    "WITH (n), RAND() AS random \n" +
                    "ORDER BY random LIMIT 3000 \n" +
                    "OPTIONAL MATCH (n)-[r]-(m)\n" +
                    //"WITH n,r,m WHERE exists(n.pagerank) AND exists(m.pagerank) AND exists(m.community) \n" +
                    "RETURN n, r, m;"; // FIXME get (optionally) from config

export default class NeoVis {

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

    constructor(config) {
        this._config = config;
        this._driver = neo4j.v1.driver(config.server_url, neo4j.v1.auth.basic(config.server_user, config.server_password)); // FIXME: handle unauthenticated / default
        this._query =   config.initial_cypher || defaultQuery;
        this._nodes = new vis.DataSet();
        this._edges = new vis.DataSet();
        this._data = {
            "nodes": this._nodes,
            "edges": this._edges
        };
        this._network = null;
        this._container = document.getElementById(config.container_id);


    }

    /**
     * Checks if this node has been added to a node list
     * FIXME: move to private api?
     * @param node
     * @param nodes
     * @returns {boolean}
     */
    static nodeExists(node, nodes) {
        var id = node['id'];
        for (var i = 0; i<nodes.length; i++) {
            if (id === nodes[i].id) {
                return true;
            }
        }
        return false;
    }

    /**
     * Build node object for vis from a neo4j Node
     * FIXME: use config
     * FIXME: move to private api
     * @param n
     * @returns {{}}
     */
     buildNodeVisObject(n) {

        var self = this;
        let node = {};
        let label = n.labels[0];

        let captionKey   = this._config.labels[label]['caption'],
            sizeKey      = this._config.labels[label]['size'],
            sizeCypher   = this._config.labels[label]['sizeCypher'],
            communityKey = this._config.labels[label]['community'];


        node['id'] = n.identity.toInt();
        
        // node size

        if (sizeCypher) {
            // use a cypher statement to determine the size of the node
            // the cypher statement will be passed a parameter {id} with the value
            // of the internal node id

            let session = this._driver.session();
            session.run(sizeCypher, {id: neo4j.v1.int(node['id'])})
                .then(function(result) {
                    result.records.forEach(function(record) {
                        record.forEach(function(v,k,r) {
                            if (typeof v === "number") {
                                self._nodes.update({id: node['id'], value: v});
                            } else if (v.constructor.name === "Integer") {
                                self._nodes.update({id: node['id'], value: v.toNumber()});
                            }
                        })
                    })
                })


        } else if (typeof sizeKey === "number") {
            node['value'] = sizeKey;
        } else {

            let sizeProp = n.properties[sizeKey];

            if (sizeProp && typeof sizeProp === "number") {
                // propety value is a number, OK to use
                node['value'] = sizeProp;
            } else if (sizeProp && typeof sizeProp === "object" && sizeProp.constructor.name === "Integer") {
                // property value might be a Neo4j Integer, check if we can call toNumber on it:
                if (sizeProp.inSafeRange()) {
                    node['value'] = sizeProp.toNumber();
                } else {
                    // couldn't convert to Number, use default
                    node['value'] = 1.0;
                }
            } else {
                node['value'] = 1.0;
            }
        }

        // node caption
        node['label'] = n.properties[captionKey] || label || "";

        // community
        // behavior: color by value of community property (if set in config), then color by label
        //node['group'] = n.properties.community ? n.properties.community.toInt() : 0;

        if (!communityKey) {
            node['group'] = label;
        } else {
            node['group'] = n.properties[communityKey] || label || 0;
        }


        //  FIXME: this is NOT the node caption. What is it?
        //node['title'] = n.properties[captionKey] || "";
        return node;
    }

    /**
     * Build edge object for vis from a neo4j Relationship
     * @param r
     * @returns {{}}
     */
    buildEdgeVisObject(r) {
        var edge = {};
        edge['id'] = r.identity.toInt();
        edge['from'] = r.start.toInt();
        edge['to'] = r.end.toInt();
        edge['value'] = r.properties.weight;
        //edge['value'] = 0.01;
        edge['title'] = r.type;

        // TODO: styling from config

        return edge;
    }

    // public API

    render() {

        // connect to Neo4j instance
        // run query

        let self = this;

        let session = this._driver.session();
        session
            .run(this._query, {limit: 30})
            .then(function(result){
                console.log("RESULT OBJECT:");
                console.log(result);
                result.records.forEach(function(record) {

                    record.forEach(function(v,k,r) {
                        console.log("CLASS NAME");
                        console.log(v.constructor.name);
                        console.log(v);


                        if (v.constructor.name === "Node") {
                            let node = self.buildNodeVisObject(v);


                            try {
                                self._nodes.add(node);
                            } catch(e) {
                                console.log(e);
                            }


                        }
                        else if (v.constructor.name === "Relationship") {
                            //var mNode = NeoVis.buildNodeVisObject(m);
                            //if (!NeoVis.nodeExists(mNode, nodes)) {
                             //   nodes.push(mNode);
                            //}
                            let edge = self.buildEdgeVisObject(v);

                            try {
                                self._edges.add(edge);
                            } catch(e) {
                                console.log(e);
                            }
                            //edges.push(edge);
                        }

                    });

                });



                // let data = {
                //     nodes: self._nodes,
                //     edges: self._edges
                // };

                let options = {
                    nodes: {
                        shape: 'dot',
                        font: {
                            size: 26,
                            strokeWidth: 7
                        }
                    },
                    edges: {
                        arrows: {
                            to: {enabled: self._config.arrows } // FIXME: handle default value
                        }
                    },
                    layout: {
                        improvedLayout: true
                    },
                    physics: {
                        enabled: true
                    }
                };


                var container = self._container;

                self._network = new vis.Network(container, self._data, options);
            })
            .catch(function(error) {
                console.log(error);
            });



    };

    /**
     * Clear the data for the visualization
     */
    clearNetwork() {
        this._nodes.clear();
        this._edges.clear();
        this._network.setData(this._data);
    }


    /**
     * Reset the config object and reload data
     * @param config
     */
    reinit(config) {

    };

    /**
     * Fetch live data form the server and reload the visualization
     */
    reload() {

        this.clearNetwork();
        this.render();

    };

    /**
     * Execute an arbitrary Cypher query and re-render the visualization
     * @param query
     */
    renderWithCypher(query) {

        //self._config.initial_cypher = query;

        this.clearNetwork();
        this._query = query;
        this.render();

    };

    // configure exports based on environment (ie Node.js or browser)
    //if (typeof exports === 'object') {
    //    module.exports = NeoVis;
    //} else {
    //    define (function () {return NeoVis;})
    //}

}

