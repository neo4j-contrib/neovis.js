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

[src/types.ts:128](https://github.com/thebestnom/neovis.js/blob/2890321/src/types.ts#L128)

___

### container\_id

• **container\_id**: `string`

Html id of the element you want Neovis to render on

#### Inherited from

[BaseNeovisConfig](BaseNeovisConfig.md).[container_id](BaseNeovisConfig.md#container_id)

#### Defined in

[src/types.ts:104](https://github.com/thebestnom/neovis.js/blob/2890321/src/types.ts#L104)

___

### defaultLabelConfig

• `Optional` **defaultLabelConfig**: [`NonFlatLabelConfig`](../README.md#nonflatlabelconfig)

#### Defined in

[src/types.ts:323](https://github.com/thebestnom/neovis.js/blob/2890321/src/types.ts#L323)

___

### defaultRelationshipsConfig

• `Optional` **defaultRelationshipsConfig**: [`NonFlatRelationsipConfig`](../README.md#nonflatrelationsipconfig)

#### Defined in

[src/types.ts:324](https://github.com/thebestnom/neovis.js/blob/2890321/src/types.ts#L324)

___

### initial\_cypher

• `Optional` **initial\_cypher**: `string`

The Cypher query that will get the data

#### Inherited from

[BaseNeovisConfig](BaseNeovisConfig.md).[initial_cypher](BaseNeovisConfig.md#initial_cypher)

#### Defined in

[src/types.ts:123](https://github.com/thebestnom/neovis.js/blob/2890321/src/types.ts#L123)

___

### labels

• `Optional` **labels**: `Record`<`string`, [`NonFlatLabelConfig`](../README.md#nonflatlabelconfig)\>

#### Defined in

[src/types.ts:325](https://github.com/thebestnom/neovis.js/blob/2890321/src/types.ts#L325)

___

### neo4j

• `Optional` **neo4j**: `Driver` \| [`Neo4jConfig`](Neo4jConfig.md)

Neo4j Driver instance or configuration to make one

#### Inherited from

[BaseNeovisConfig](BaseNeovisConfig.md).[neo4j](BaseNeovisConfig.md#neo4j)

#### Defined in

[src/types.ts:113](https://github.com/thebestnom/neovis.js/blob/2890321/src/types.ts#L113)

___

### nonFlat

• **nonFlat**: ``true``

Tells Neovis is the config is flat or not

#### Overrides

[BaseNeovisConfig](BaseNeovisConfig.md).[nonFlat](BaseNeovisConfig.md#nonflat)

#### Defined in

[src/types.ts:322](https://github.com/thebestnom/neovis.js/blob/2890321/src/types.ts#L322)

___

### relationships

• `Optional` **relationships**: `Record`<`string`, [`NonFlatRelationsipConfig`](../README.md#nonflatrelationsipconfig)\>

#### Defined in

[src/types.ts:326](https://github.com/thebestnom/neovis.js/blob/2890321/src/types.ts#L326)

___

### server\_database

• `Optional` **server\_database**: `string`

database name you want to connect to

**`default`** neo4j

#### Inherited from

[BaseNeovisConfig](BaseNeovisConfig.md).[server_database](BaseNeovisConfig.md#server_database)

#### Defined in

[src/types.ts:109](https://github.com/thebestnom/neovis.js/blob/2890321/src/types.ts#L109)

___

### visConfig

• `Optional` **visConfig**: `Options`

Vis network config to override neovis defaults

**`link`** https://visjs.github.io/vis-network/docs/network/#options

#### Inherited from

[BaseNeovisConfig](BaseNeovisConfig.md).[visConfig](BaseNeovisConfig.md#visconfig)

#### Defined in

[src/types.ts:118](https://github.com/thebestnom/neovis.js/blob/2890321/src/types.ts#L118)
