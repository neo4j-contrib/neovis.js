'use strict';

// FIXME: need to figure out dependency loading
//
//var neo4j = require('neo4j-driver').v1;
//var vis = require('../vendor/vis.min.js');

var NeoVis = (function () {

    /**
     *
     * @param config - configures the visualization and Neo4j server connection
     *  {
     *    container:
     *    server_url:
     *    server_password?:
     *    server_username?:
     *    labels:
     *
     *  }
     *
     * @constructor
     */
    function NeoVis(config) {
        this._config = config;
        this._driver = neo4j.v1.driver("bolt://localhost", neo4j.v1.auth.basic("neo4j", "letmein")); // FIXME get params from config
        this._query =   "MATCH (n) \n" +
                        "WITH (n), RAND() AS random \n" +
                        "ORDER BY random LIMIT {limit} \n" +
                        "OPTIONAL MATCH (n)-[r]->(m) \n" +
                        "RETURN n, r, m;"; // FIXME get (optionally) from config

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
    function nodeExists(node, nodes) {
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
    function buildNodeVisObject(n) {
        var node = {};
        node['id'] = n.identity.toInt();
        
        
        node['value'] = n.properties.betweenness.toInt();
        node['label'] = n.properties.name;
        node['group'] = n.properties.community.toInt();
        node['title'] = n.properties.name;
        return node;
    }

    /**
     * Build edge object for vis from a neo4j Relationship
     * @param r
     * @returns {{}}
     */
    function buildEdgeVisObject(r) {
        var edge = {};
        edge['from'] = r.start.toInt();
        edge['to'] = r.end.toInt();
        edge['value'] = r.properties.weight;
        edge['title'] = r.type;

        return edge;
    }

    // public API

    NeoVis.prototype.render = function() {

        // connect to Neo4j instance
        // run query

        var self = this;
        var nodes = []; // FIXME: move to instance var
        var edges = []; // FIXME: move to instance var

        var session = this._driver.session();
        session
            .run(this._query, {limit: 20})
            .then(function(result){
                result.records.forEach(function(record) {
                    // get node(s) and rel
                    // add to global nodes / rels
                    var n = record.get("n");
                    console.log(record.get("n"));
                    var node = buildNodeVisObject(n);


                    if (!nodeExists(node, nodes)) {
                        nodes.push(node);
                    }

                    if (record.get("r")) {
                        console.log("Has an edge");
                        var r = record.get("r");
                        var m = record.get("m");
                        var mNode = buildNodeVisObject(m);
                        if (!nodeExists(mNode, nodes)) {
                            nodes.push(mNode);
                        }
                        var edge = buildEdgeVisObject(r);
                        
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
                        shape: 'dot'
                    }
                };

                var container = self._container;

                self._network = new vis.Network(container, data, options);
            })



    };


    /**
     * Reset the config object and reload data
     * @param config
     */
    NeoVis.prototype.reinit = function(config) {

    };

    /**
     * Fetch live data form the server and reload the visualization
     */
    NeoVis.prototype.reload = function() {

    };

    /**
     * Execute an arbitrary Cypher query and re-render the visualization
     * @param query
     */
    NeoVis.prototype.renderWithCypher = function(query) {

    };

    // configure exports based on environment (ie Node.js or browser)
    //if (typeof exports === 'object') {
    //    module.exports = NeoVis;
    //} else {
    //    define (function () {return NeoVis;})
    //}

    return NeoVis;
}());
