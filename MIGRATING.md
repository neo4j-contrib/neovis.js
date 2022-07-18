# Migrating From 1.X

2.0.0 was designed to be an extension of vis-network instead of a wrapper, that's means that all custom-made properties
are now the vis-network name


Also any snake_case parameters are now camelCase

## quick migration
```ts
oldConfig = {
    //... old configuration
}
const newConfig = NeoVis.migrateFromOldConfig(oldConfig);
// or
import { migrateFromOldConfig } from "neovis.js";
const newConfig = migrateFromOldConfig(oldConfig)
```


## specifics

- any snake_case parameter is now camelCase

```ts
// before
const config = {
    container_id: "divId",
    initial_cypher: "MATCH (a) RETURN a",
    server_database: "neo4j",
    console_debug: true
    // ...
}
//after
const config = {
    containerId: "divId",
    initialCypher: "MATCH (a) RETURN a",
    serverDatabase: "neo4j",
    consoleDebug: true
    // ...
}
```

- neo4j driver configuration moved from flat onto the config object to `neo4j` onto the object

```ts
// before
const config = {
    // ...
    server_url: "bolt://localhost:7687",
    server_user: "neo4j",
    server_password: "sorts-swims-burglaries",
    encrypted: "ENCRYPTION_ON",
    trust: "TRUST_SYSTEM_CA_SIGNED_CERTIFICATES"
    // ...
}
//after
const config = {
    // ...
    neo4j: { // this can also be a Neo4J driver instance now instead of object
        serverUrl: 'bolt://localhost:7687',
        serverUser: 'neo4j',
        serverPassword: 'gland-presentation-worry',
        driverConfig: { // full driver config object by neo4j https://neo4j.com/docs/api/javascript-driver/current/function/index.html#configuration
            encrypted: "ENCRYPTION_ON",
            trust: "TRUST_SYSTEM_CA_SIGNED_CERTIFICATES"
        }
    }
    // ...
}
```

- any flat change on the object for the network is now under visConfig and uses the config from vis-network
  https://visjs.github.io/vis-network/docs/network/

```ts
// before
const config = {
    // ...
    arrows: true,
    hierarchical: true,
    hierarchical_sort_method: "directed"
    // ...
}
// after
const config = {
    // ...
    visConfig: {
        edges: {
            arrows: {
                to: {enabled: true}
            }
        },
        layout: {
            enabled: true,
            sortMethod: 'directed'
        }
    },
    // ...
}
```

- changed node and relationship config to be vis-network node and edge extension and more consistent

```ts
// before
const config = {
    // ...
    labels: {
        Label: {
            caption: "name",
            size: "pagerank",
            community: "community",
            image: 'https://visjs.org/images/visjs_logo.png',
            font: {
                size: 26,
                color: "#000000"
            },
            title_properties: [
                "name",
                "pagerank"
            ],
            sizeCypher: "MATCH (n) WHERE id(n) = $id MATCH (n)-[r]-() RETURN sum(r.weight) AS c"
        }
    },
    relationships: {
        RELATIONSHIP: {
            "thickness": "weight",
            "caption": false
        }
    }
    // ...
}
// after
const config = {
    labels: {
        Label: { // everything that is directly on this object gets mapped from the neo4j node
            // full properties list can be found at https://visjs.github.io/vis-network/docs/network/nodes.html
            label: "name", // puts the property `name` from the neo4j node and puts it onto the label property of vis.js's node
            value: "pagerank",
            group: "community",
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {// here you put node properties that aren't mapped directly from the neo4j node
                cypher: { // everything here will map to the vis.js node object from a cypher query (like sizeCypher worked but for every property)
                    value: "MATCH (n) WHERE id(n) = $id MATCH (n)-[r]-() RETURN sum(r.weight) AS c"
                },
                function: { // everything here will map function thats gets the neo4j node properties to a vis.js node property
                    title: NeoVis.objectToTitleHtml, // alternativly
                    title: (props) => NeoVis.objectToTitleHtml(props, ["name", "pagerank"])
                },
                static: { // everything here will be copied directly to the vis.js's node object
                    font: {
                        size: 26,
                        color: "#000000"
                    },
                    shape: "image",
                    image: 'https://visjs.org/images/visjs_logo.png'
                }
            }
        }
    },
    relationships: {
        RELATIONSHIP: { // same as node but mapped from neo4j relationship to vis.js edge
            // full properties list can be found at https://visjs.github.io/vis-network/docs/network/edges.html
            value: "weight",
            // the default is now without caption
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {// here you put edge properties that aren't mapped directly from the neo4j relationship
                cypher: {}, // same as label advance cypher
                function: { // same as label advance function
                    title: NeoVis.objectToTitleHtml // putting caption on the title
                },
                static: {} // same as label advance static
            }
        }
    }
}
```
