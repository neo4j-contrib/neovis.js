[neovis.js](../README.md) / NonFlatNeovisConfig

# Interface: NonFlatNeovisConfig

non flat version of the configuration (without Symbols)
look at the normal config for more information

**`example`**
```js
{
     container_id: 'viz',
     nonFlat: true,
     neo4j: {
     	server_url: 'bolt://localhost:7687',
     	server_user: 'neo4j',
     	server_password: 'gland-presentation-worry'
     },
     visConfig: {
     	nodes: {
     		shape: 'square'
     	},
     	edges: {
     		arrows: {
     			to: {enabled: true}
     		}
     	},
     },
     labels: {
     	Character: {
     		property: {
     		    label: 'pagerank',
     		    group: 'community'
     	    }
     		cypher: {
     			value: "MATCH (n) WHERE id(n) = $id RETURN n.size"
     		},
     		function: {
     			title: (node) => {
     				return viz.nodeToHtml(node, undefined);
     			}
     		}
     	}
     },
     relationships: {
     	INTERACTS: {
             property: {
     		    value: 'weight'
     	    }
     		function: {
     			title: (edge) => {
     				return viz.nodeToHtml(edge, undefined);
     			}
     		}
     	}
     },
     initial_cypher: 'MATCH (n)-[r]->(m) RETURN n,r,m'
}
```

## Hierarchy

- [*BaseNeovisConfig*](baseneovisconfig.md)

  ↳ **NonFlatNeovisConfig**

## Table of contents

### Properties

- [console\_debug](nonflatneovisconfig.md#console_debug)
- [container\_id](nonflatneovisconfig.md#container_id)
- [defaultLabelConfig](nonflatneovisconfig.md#defaultlabelconfig)
- [defaultRelationshipsConfig](nonflatneovisconfig.md#defaultrelationshipsconfig)
- [initial\_cypher](nonflatneovisconfig.md#initial_cypher)
- [labels](nonflatneovisconfig.md#labels)
- [neo4j](nonflatneovisconfig.md#neo4j)
- [nonFlat](nonflatneovisconfig.md#nonflat)
- [relationships](nonflatneovisconfig.md#relationships)
- [server\_database](nonflatneovisconfig.md#server_database)
- [visConfig](nonflatneovisconfig.md#visconfig)

## Properties

### console\_debug

• `Optional` **console\_debug**: *boolean*

Should output debug messages to console

**`default`** false

Inherited from: [BaseNeovisConfig](baseneovisconfig.md).[console_debug](baseneovisconfig.md#console_debug)

Defined in: [index.d.ts:127](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L127)

___

### container\_id

• **container\_id**: *string*

Html id of the element you want NeoVis to render on

Inherited from: [BaseNeovisConfig](baseneovisconfig.md).[container_id](baseneovisconfig.md#container_id)

Defined in: [index.d.ts:103](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L103)

___

### defaultLabelConfig

• `Optional` **defaultLabelConfig**: [*NonFlatNeoVisAdvanceConfig*](nonflatneovisadvanceconfig.md)<Node, Node<number\>\>

Defined in: [index.d.ts:319](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L319)

___

### defaultRelationshipsConfig

• `Optional` **defaultRelationshipsConfig**: [*NonFlatNeoVisAdvanceConfig*](nonflatneovisadvanceconfig.md)<Edge, Relationship<number\>\>

Defined in: [index.d.ts:320](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L320)

___

### initial\_cypher

• `Optional` **initial\_cypher**: *string*

The Cypher query that will get the data

Inherited from: [BaseNeovisConfig](baseneovisconfig.md).[initial_cypher](baseneovisconfig.md#initial_cypher)

Defined in: [index.d.ts:122](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L122)

___

### labels

• `Optional` **labels**: *Record*<string, [*NonFlatNeoVisAdvanceConfig*](nonflatneovisadvanceconfig.md)<Node, Node<number\>\>\>

Defined in: [index.d.ts:321](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L321)

___

### neo4j

• `Optional` **neo4j**: [*Neo4jConfig*](neo4jconfig.md) \| Driver

Neo4j Driver instance or configuration to make one

Inherited from: [BaseNeovisConfig](baseneovisconfig.md).[neo4j](baseneovisconfig.md#neo4j)

Defined in: [index.d.ts:112](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L112)

___

### nonFlat

• **nonFlat**: ``true``

Tells Neovis is the config is flat or not

Overrides: [BaseNeovisConfig](baseneovisconfig.md).[nonFlat](baseneovisconfig.md#nonflat)

Defined in: [index.d.ts:318](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L318)

___

### relationships

• `Optional` **relationships**: *Record*<string, [*NonFlatNeoVisAdvanceConfig*](nonflatneovisadvanceconfig.md)<Edge, Relationship<number\>\>\>

Defined in: [index.d.ts:322](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L322)

___

### server\_database

• `Optional` **server\_database**: *string*

database name you want to connect to

**`default`** neo4j

Inherited from: [BaseNeovisConfig](baseneovisconfig.md).[server_database](baseneovisconfig.md#server_database)

Defined in: [index.d.ts:108](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L108)

___

### visConfig

• `Optional` **visConfig**: Options

Vis network config to override neovis defaults

**`link`** https://visjs.github.io/vis-network/docs/network/#options

Inherited from: [BaseNeovisConfig](baseneovisconfig.md).[visConfig](baseneovisconfig.md#visconfig)

Defined in: [index.d.ts:117](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L117)
