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

- [`BaseNeovisConfig`](BaseNeovisConfig.md)

  ↳ **`NonFlatNeovisConfig`**

## Table of contents

### Properties

- [console\_debug](NonFlatNeovisConfig.md#console_debug)
- [container\_id](NonFlatNeovisConfig.md#container_id)
- [defaultLabelConfig](NonFlatNeovisConfig.md#defaultlabelconfig)
- [defaultRelationshipsConfig](NonFlatNeovisConfig.md#defaultrelationshipsconfig)
- [initial\_cypher](NonFlatNeovisConfig.md#initial_cypher)
- [labels](NonFlatNeovisConfig.md#labels)
- [neo4j](NonFlatNeovisConfig.md#neo4j)
- [nonFlat](NonFlatNeovisConfig.md#nonflat)
- [relationships](NonFlatNeovisConfig.md#relationships)
- [server\_database](NonFlatNeovisConfig.md#server_database)
- [visConfig](NonFlatNeovisConfig.md#visconfig)

## Properties

### console\_debug

• `Optional` **console\_debug**: `boolean`

Should output debug messages to console

**`default`** false

#### Inherited from

[BaseNeovisConfig](BaseNeovisConfig.md).[console_debug](BaseNeovisConfig.md#console_debug)

#### Defined in

[src/neovis.ts:134](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L134)

___

### container\_id

• **container\_id**: `string`

Html id of the element you want Neovis to render on

#### Inherited from

[BaseNeovisConfig](BaseNeovisConfig.md).[container_id](BaseNeovisConfig.md#container_id)

#### Defined in

[src/neovis.ts:110](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L110)

___

### defaultLabelConfig

• `Optional` **defaultLabelConfig**: `NonFlatLabelConfig`

#### Defined in

[src/neovis.ts:330](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L330)

___

### defaultRelationshipsConfig

• `Optional` **defaultRelationshipsConfig**: `NonFlatRelationsipConfig`

#### Defined in

[src/neovis.ts:331](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L331)

___

### initial\_cypher

• `Optional` **initial\_cypher**: `string`

The Cypher query that will get the data

#### Inherited from

[BaseNeovisConfig](BaseNeovisConfig.md).[initial_cypher](BaseNeovisConfig.md#initial_cypher)

#### Defined in

[src/neovis.ts:129](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L129)

___

### labels

• `Optional` **labels**: `Record`<`string`, `NonFlatLabelConfig`\>

#### Defined in

[src/neovis.ts:332](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L332)

___

### neo4j

• `Optional` **neo4j**: [`Neo4jConfig`](Neo4jConfig.md) \| `Driver`

Neo4j Driver instance or configuration to make one

#### Inherited from

[BaseNeovisConfig](BaseNeovisConfig.md).[neo4j](BaseNeovisConfig.md#neo4j)

#### Defined in

[src/neovis.ts:119](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L119)

___

### nonFlat

• **nonFlat**: ``true``

Tells Neovis is the config is flat or not

#### Overrides

[BaseNeovisConfig](BaseNeovisConfig.md).[nonFlat](BaseNeovisConfig.md#nonflat)

#### Defined in

[src/neovis.ts:329](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L329)

___

### relationships

• `Optional` **relationships**: `Record`<`string`, `NonFlatRelationsipConfig`\>

#### Defined in

[src/neovis.ts:333](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L333)

___

### server\_database

• `Optional` **server\_database**: `string`

database name you want to connect to

**`default`** neo4j

#### Inherited from

[BaseNeovisConfig](BaseNeovisConfig.md).[server_database](BaseNeovisConfig.md#server_database)

#### Defined in

[src/neovis.ts:115](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L115)

___

### visConfig

• `Optional` **visConfig**: `Options`

Vis network config to override neovis defaults

**`link`** https://visjs.github.io/vis-network/docs/network/#options

#### Inherited from

[BaseNeovisConfig](BaseNeovisConfig.md).[visConfig](BaseNeovisConfig.md#visconfig)

#### Defined in

[src/neovis.ts:124](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L124)
