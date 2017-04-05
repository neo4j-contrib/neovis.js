'use strict';

// FIXME: need to figure out dependency loading
//
//var neo4j = require('neo4j-driver').v1;
//var vis = require('../vendor/vis.min.js');


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
        this._nodes = null;
        this._edges = null;
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
    static buildNodeVisObject(n) {
        var node = {};
        node['id'] = n.identity.toInt();
        
        
        node['value'] = n.properties.betweenness;
        node['label'] = n.properties.name;
        node['group'] = n.properties.community ? n.properties.community.toInt() : 0;
        node['title'] = n.properties.name;
        return node;
    }

    /**
     * Build edge object for vis from a neo4j Relationship
     * @param r
     * @returns {{}}
     */
    static buildEdgeVisObject(r) {
        var edge = {};
        edge['from'] = r.start.toInt();
        edge['to'] = r.end.toInt();
        edge['value'] = r.properties.weight;
        //edge['value'] = 0.01;
        edge['title'] = r.type;

        return edge;
    }

    // public API

    render() {

        // connect to Neo4j instance
        // run query

        var self = this;
        var nodes = []; // FIXME: move to instance var
        var edges = []; // FIXME: move to instance var

        var session = this._driver.session();
        session
            .run(this._query, {limit: 30})
            .then(function(result){
                console.log("RESULT OBJECT:");
                console.log(result);
                result.records.forEach(function(record) {
                    // get node(s) and rel
                    // add to global nodes / rels

                    console.log("RECORD OBJECT");
                    console.log(record);
                    // FIXME: get all nodes, relationships without specifying column (inspect result object to infer type of thing returned)

                    var n = record.get("n");
                    console.log(record.get("n"));
                    var node = NeoVis.buildNodeVisObject(n);


                    if (!NeoVis.nodeExists(node, nodes)) {
                        nodes.push(node);
                    }

                    if (record.get("r")) {
                        console.log("Has an edge");
                        var r = record.get("r");
                        var m = record.get("m");
                        var mNode = NeoVis.buildNodeVisObject(m);
                        if (!NeoVis.nodeExists(mNode, nodes)) {
                            nodes.push(mNode);
                        }
                        var edge = NeoVis.buildEdgeVisObject(r);
                        
                        edges.push(edge);
                    } else {
                        console.log("No Edge");
                    }

                });



                var data = {
                    nodes: nodes,
                    edges: edges
                };
                var options = {
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

                self._network = new vis.Network(container, data, options);
            })
            .catch(function(error) {
                console.log(error);
            });



    };


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

        this.render();

    };

    /**
     * Execute an arbitrary Cypher query and re-render the visualization
     * @param query
     */
    renderWithCypher(query) {

        //self._config.initial_cypher = query;

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

