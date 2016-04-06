'use strict';

// FIXME: need to figure out dependency loading
//var neo4j = require('../vendor/neo4j-javascript-driver/neo4j-web');
//var neo4j = require('neo4j');
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

    // public API

    NeoVis.prototype.render = function() {

        // connect to Neo4j instance
        // run query

        var self = this;

        var session = this._driver.session();
        session
            .run(this._query, {limit: 200})
            .then(function(result){
                result.records.forEach(function(record) {
                    // get node(s) and rel
                    // add to global nodes / rels
                });
                // add to the vis and render it
                
                // FIXME fake data
                // create people.
                // value corresponds with the age of the person
                var nodes = [
                    {id: 1,  value: 2,  label: 'Algie' },
                    {id: 2,  value: 31, label: 'Alston'},
                    {id: 3,  value: 12, label: 'Barney'},
                    {id: 4,  value: 16, label: 'Coley' },
                    {id: 5,  value: 17, label: 'Grant' },
                    {id: 6,  value: 15, label: 'Langdon'},
                    {id: 7,  value: 6,  label: 'Lee'},
                    {id: 8,  value: 5,  label: 'Merlin'},
                    {id: 9,  value: 30, label: 'Mick'},
                    {id: 10, value: 18, label: 'Tod'},
                ];

                // create connections between people
                // value corresponds with the amount of contact between two people
                var edges = [
                    {from: 2, to: 8, value: 3, title: '3 emails per week'},
                    {from: 2, to: 9, value: 5, title: '5 emails per week'},
                    {from: 2, to: 10,value: 1, title: '1 emails per week'},
                    {from: 4, to: 6, value: 8, title: '8 emails per week'},
                    {from: 5, to: 7, value: 2, title: '2 emails per week'},
                    {from: 4, to: 5, value: 1, title: '1 emails per week'},
                    {from: 9, to: 10,value: 2, title: '2 emails per week'},
                    {from: 2, to: 3, value: 6, title: '6 emails per week'},
                    {from: 3, to: 9, value: 4, title: '4 emails per week'},
                    {from: 5, to: 3, value: 1, title: '1 emails per week'},
                    {from: 2, to: 7, value: 4, title: '4 emails per week'}
                ];
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

    return NeoVis;
}());
