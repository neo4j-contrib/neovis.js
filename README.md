# neovis.js

[![Actions Build Status](https://github.com/neo4j-contrib/neovis.js/workflows/CI/badge.svg?branch=master)]()[![npm version](https://badge.fury.io/js/neovis.js.svg)](https://badge.fury.io/js/neovis.js)

Graph visualizations powered by vis.js with data from Neo4j.

![](img/example-viz.png)

## Features

- [x] Connect to Neo4j instance to get live data
- [x] User specified labels and property to be displayed
- [x] User specified Cypher query to populate 
- [x] Specify node property for url of image for node
- [x] Specify edge property for edge thickness
- [x] Specify node property for community / clustering
- [x] Specify node property for node size
- [x] Configure popover


## Install

Neovis.js can be installed via npm:

```
npm install --save neovis.js
```

you can also obtain neovis.js via CDN:

## CDN

For ease of use Neovis.js can be obtained from Neo4jLabs CDN:

*Most recent release*

```
<script src="https://cdn.neo4jlabs.com/neovis.js/v1.5.0/neovis.js"></script>
```

*Version without neo4j-driver dependency*

```
<script src="https://cdn.neo4jlabs.com/neovis.js/v1.5.0/neovis-without-dependencies.js"></script>
```

## Quickstart Example

Let's go through the steps to reproduce this visualization:

![](img/example-viz.png)

### Prepare Neo4j

Start with a blank Neo4j instance, or spin up a blank [Neo4j Sandbox](https://neo4jsandbox.com). We'll load the Game of Thrones dataset, run:

```
LOAD CSV WITH HEADERS FROM "https://raw.githubusercontent.com/mathbeveridge/asoiaf/master/data/asoiaf-all-edges.csv" AS row
MERGE (src:Character {name: row.Source})
MERGE (tgt:Character {name: row.Target})
MERGE (src)-[r:INTERACTS]->(tgt) ON CREATE SET r.weight = toInteger(row.weight)
```

We've pre-calculated PageRank and ran a community detection algorithm to assign community ids for each Character. Let's load those next:

```
LOAD CSV WITH HEADERS FROM "https://raw.githubusercontent.com/johnymontana/neovis.js/master/examples/data/got-centralities.csv" AS row
MATCH (c:Character {name: row.name})
SET c.community = toInteger(row.community),
    c.pagerank  = toFloat(row.pagerank)
```

Our graph now consists of `Character` nodes that are connected by an `INTERACTS` relationships. We can visualize the whole graph in Neo4j Browser by running:

```
MATCH p=(:Character)-[:INTERACTS]->(:Character)
RETURN p
```

![](/img/got-neo4j-browser.png)

We can see characters that are connected and with the help of the force directed layout we can begin to see clusters in the graph. However, we want to visualize the centralities (PageRank) and community detection results that we also imported.

Specifically we would like:

* Node size to be proportional to the Character's `pagerank` score. This will allow us to quickly identify important nodes in the network.
* Node color to determined by the `community` property. This will allow us to visualize clusters.
* Relationship thickeness should be proportional to the `weight` property on the `INTERACTS` relationship.

Neovis.js, by combining the JavaScript driver for Neo4j and the vis.js visualization library will allow us to build this visualization.

### index.html

Create a new html file:

``` html
<!doctype html>
<html>
    <head>
        <title>Neovis.js Simple Example</title>
        <style type="text/css">
            html, body {
                font: 16pt arial;
            }
    
            #viz {
                width: 900px;
                height: 700px;
                border: 1px solid lightgray;
                font: 22pt arial;
            }
        </style>
    </head>
    <body onload="draw()">
        <div id="viz"></div>
    </body>    
</html>

```

We define some basic CSS to specify the boundaries of a `div` and then create a single `div` in the body. We also specify `onload="draw()"` so that the `draw()` function is called as soon as the body is loaded. 

We need to pull in `neovis.js`:

``` html
<script src="https://rawgit.com/neo4j-contrib/neovis.js/master/dist/neovis.js"></script>
```

And define our draw() function:

```
<script type="text/javascript">

        var viz;

        function draw() {
            var config = {
                container_id: "viz",
                server_url: "bolt://localhost:7687",
                server_user: "neo4j",
                server_password: "sorts-swims-burglaries",
                labels: {
                    "Character": {
                        "caption": "name",
                        "size": "pagerank",
                        "community": "community",
                        "title_properties": [
                            "name",
                            "pagerank"
                        ]
                    }
                },
                relationships: {
                    "INTERACTS": {
                        "thickness": "weight",
                        "caption": false
                    }
                },
                initial_cypher: "MATCH (n)-[r:INTERACTS]->(m) RETURN *"
            };

            viz = new NeoVis.default(config);
            viz.render();
        }
    </script>
```

This function creates a `config` object that specifies how to connect to Neo4j, what data to fetch, and how to configure the visualization.

![](/img/example-viz.png)


See [simple-example.html](/examples/simple-example.html) for the full code.

### module usage
you can also use it as module, but it would require you have a way to import css files

```javascript
import NeoVis from 'neovis.js';
```

or you can import the version with bundled dependency

```javascript
import NeoVis from 'neovis.js/dist/neovis.js';
```

## Build

This project uses git submodules to include the dependencies for neo4j-driver and vis.js. This project uses webpack to build a bundle that includes all project dependencies. `webpack.config.js` contains the configuration for webpack. After cloning the repo:

```
npm install
npm run build
```

will build `dist/neovis.js` and `dist/neovis-without-dependencies.js` 

## Documentation

* `Neovis.default(config)`
* `Neovis.clearNetwork()`
* `Neovis.reinit(config)`
* `Neovis.reload()`
* `Neovis.stabilize()`
* `Neovis.renderWithCypher(statement)`
* `Neovis.updateWithCypher(statement)`

* `config`

### `Neovis.default(config)`

Constructor for Neovis. Creates new Neovis object, given configuration. See [config](#config)

### `Neovis.clearNetwork()`

Clears network visualization

### `Neovis.reinit(config)`

Reinitializes the network visualization with a new `config` object. See [config](#config)

### `Neovis.reload()`

Reload the visualization. Will fetch data again from Neo4j per `initial_cypher` in the config object.

### `Neovis.stabilize()`

Stop the physics simulation.

### `Neovis.renderWithCypher(statement)`

Render a new visualization with results from a Cypher statement. Any `Node` and `Relationship` objects returned in the Cypher query will be rendered in the visualization. Paths are not currently supported.

### `Neovis.updateWithCypher(statement)`

Update the current visualization with results from a Cypher statement. Any `Node` and `Relationship` objects returned in the Cypher query will be rendered in the visualization. Paths are not currently supported.

### `config`

A configuration object that defines:

* how to connect to Neo4j (required)
* an initial Cypher query for loading data for the visualization (optional)
* the DOM element in which the visualization should be rendered (required)
* how to style elements of the visualization (`labels` and `relationships`) (required)

Example:

~~~ js
var config = {
                container_id: "viz",
                server_url: "bolt://localhost:7687",
                server_user: "neo4j",
                server_password: "sorts-swims-burglaries",
                labels: {
                    //"Character": "name",
                    "Character": {
                        "caption": "name",
                        "size": "pagerank",
                        "community": "community",
                        //"image": 'https://visjs.org/images/visjs_logo.png',
                        "title_properties": [
                            "name",
                            "pagerank"
                        ],
                        //"sizeCypher": "MATCH (n) WHERE id(n) = {id} MATCH (n)-[r]-() RETURN sum(r.weight) AS c"
                    },
                    [NeoVis.NEOVIS_DEFAULT_CONFIG]: {
                         "caption": "defaultCaptionProperty",
                         "size": "defaultPagerank",
                         "community": "defaultCommunity"
                         //"sizeCypher": "defaultSizeCypher"
                                            
                    }
                },
                relationships: {
                    "INTERACTS": {
                        "thickness": "weight",
                        "caption": false
                    },
                    [NeoVis.NEOVIS_DEFAULT_CONFIG]: {
                         "thickness": "defaultThicknessProperty",
                         "caption": "defaultCaption"
                    }
                },
                initial_cypher: "MATCH (n)-[r:INTERACTS]->(m) RETURN n,r,m"
            };

            viz = new NeoVis.default(config);
            viz.render();
~~~

#### `config.container_id`

#### `config.server_url`

#### `config.server_user`

#### `config.server_password`

#### `config.server_database`
(Only for Neo4j 4 and above) The name of database connecting to.  

### `NeoVis.NEOVIS_DEFAULT_CONFIG`
For both `config.labels` and `config.relationships` NeoVis.NEOVIS_DEFAULT_CONFIG 
symbol can be added, which have the have the same properties as the normal config for specific 
label/relationshipType
you can use it by either `NeoVis.NEOVIS_DEFAULT_CONFIG` if you are using NeoVis as global
or you can use it by 
~~~js
import { NEOVIS_DEFAULT_CONFIG } from 'neovis.js'; 
~~~
#### `config.labels`

``` 
"Character": {
    "caption": "name",
    "size": "pagerank",
    "community": "community",
    "image": 'https://visjs.org/images/visjs_logo.png',
    "font": {
        "size":26,
        "color":"#000000"
    },
    "title_properties": [
        "name",
        "pagerank"
    ],
    sizeCypher: "MATCH (n) WHERE id(n) = $id MATCH (n)-[r]-() RETURN sum(r.weight) AS c"
}
```
##### `config.labels.caption`
`String`: The property name to use as node caption.  
or `Function`: A function takes a [Neo4j node](https://neo4j.com/docs/api/javascript-driver/current/class/src/graph-types.js~Node.html) and return a string caption.  
Default to no caption.  
##### `config.labels.size`
`String`: The property name to use as node size.   
Default to `1`.  
##### `config.labels.community`
`String`: The property name to use as community (color).  \
Default to color by label.   
##### `config.labels.image`
`String`. The url of image to display.  
Default to no image (a dot will be displayed).
##### `config.labels.font`
`Object`: If `font` is supplied, the default font size configuration for node captions will be overwritten by the customized config. See `font` in [vis-network - nodes](https://visjs.github.io/vis-network/docs/network/nodes.html) for all available configuration for fonts.  
##### `config.labels.title_properties`
`Array`: If `title_properties` is supplied, only the attributes listed in it are displayed in the tooltip.
         Otherwise, all attributes are present in the tooltip.   
##### `config.labels.sizeCypher`
`String`: A Cypher query to get the size of the node. `$id` represent the id of the node to query size, and the Cypher query should return a Neo4j `Number`.  
`config.labels.sizeCypher` has a higher priority than `config.labels.size`, i.e. `sizeCypher` will overwrite the resulting size from `size` field.
#### `config.relationships`

```
{
    "INTERACTS": {
        "thickness": "weight",
        "caption": false
    }
}
```
##### `config.relationships.thickness`
`String`: The property name to use as edge thickness.   
Default to `1`.  
##### `config.relationships.caption`
`Boolean`: If set to true, the relationship type will be displayed as edge caption.  
or `String`: The property name to use as edge caption.    
#### `config.arrows`

Boolean. Defaults to false.

#### `config.hierarchical`

Boolean. Default to false.

#### `config.hierarchical_sort_method`

When hierarchical layout is enabled you may choose betweeen `"hubsize"` (default) and `"directed"`.

#### `config.initial_cypher`

#### `config.console_debug`

Defaults to not showing console messages

#### `config.encrypted`

`"ENCRYPTION_OFF"` (default) or `"ENCRYPTION_ON"`

This must be set to `"ENCRYPTION_ON"` when using a secure WebSocket connection, such as with Neo4j Aura.

#### `config.trust`

`"TRUST_ALL_CERTIFICATES"` (default) or `"TRUST_SYSTEM_CA_SIGNED_CERTIFICATES"`


