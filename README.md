# neovis.js

Graph visualizations powered by vis.js with data from Neo4j.

## Coming Soon!

![](img/example-viz.png)

## Features

- [x] Connect to Neo4j instance to get live data
- [ ] User specified labels and property to be displayed
- [ ] User specified Cypher query to populate 
- [ ] Specify node property for url of image for node
- [ ] Specify edge property for edge thickness
- [ ] Specify node property for community / clustering
- [ ] Specify node property for node size
- [ ] Configure popover

## How to use

~~~ javascript
var config = {
    container_id: "viz",
    server_url: "localhost",
    labels: {
        "Character": "name"
    },
    thick_edges: {
        "INTERACTED": "weight"
    },
    cluster_labels: {
        "Character": "community"
    }

};

var viz = new NeoVis(config);
viz.render();
~~~