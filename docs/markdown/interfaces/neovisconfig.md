[neovis.js](../README.md) / NeovisConfig

# Interface: NeovisConfig

**`example`**
```js
//simple
{
     container_id: "viz",
     neo4j: {
     	server_url: "bolt://localhost:7687",
     	server_user: "neo4j",
     	server_password: "sorts-swims-burglaries"
     },
     labels: {
     	Character: {
     		label: "name",
     		value: "pagerank",
     		group: "community"
     	}
     },
     relationships: {
     	INTERACTS: {
     		value: "weight"
     	}
     },
     initial_cypher: "MATCH (n)-[r:INTERACTS]->(m) RETURN n,r,m"
}
// advance
{
     container_id: 'viz',
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
     		label: 'pagerank',
     		group: 'community',
     		[Neovis.NEOVIS_ADVANCED_CONFIG]: {
     			cypher: {
     				value: "MATCH (n) WHERE id(n) = $id RETURN n.size"
     			},
     			function: {
     				title: (node) => {
     					return viz.nodeToHtml(node, undefined);
     				}
     			},
     		}
     	}
     },
     relationships: {
     	INTERACTS: {
     		value: 'weight',
     		[Neovis.NEOVIS_ADVANCED_CONFIG]: {
     			function: {
     				title: (edge) => {
     					return viz.nodeToHtml(edge, undefined);
     				}
     			},
     		}
     	}
     },
     initial_cypher: 'MATCH (n)-[r]->(m) RETURN n,r,m'
}
```

## Hierarchy

- [`BaseNeovisConfig`](BaseNeovisConfig.md)

  ↳ **`NeovisConfig`**

## Table of contents

### Properties

- [console\_debug](NeovisConfig.md#console_debug)
- [container\_id](NeovisConfig.md#container_id)
- [initial\_cypher](NeovisConfig.md#initial_cypher)
- [labels](NeovisConfig.md#labels)
- [neo4j](NeovisConfig.md#neo4j)
- [nonFlat](NeovisConfig.md#nonflat)
- [relationships](NeovisConfig.md#relationships)
- [server\_database](NeovisConfig.md#server_database)
- [visConfig](NeovisConfig.md#visconfig)

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

### initial\_cypher

• `Optional` **initial\_cypher**: `string`

The Cypher query that will get the data

#### Inherited from

[BaseNeovisConfig](BaseNeovisConfig.md).[initial_cypher](BaseNeovisConfig.md#initial_cypher)

#### Defined in

[src/neovis.ts:129](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L129)

___

### labels

• `Optional` **labels**: `Object`

**`example`** ```javascript
{
	Character: {
	label: 'pagerank',
		group: 'community',
		[Neovis.NEOVIS_ADVANCED_CONFIG]: {
			cypher: {
				value: "MATCH (n) WHERE id(n) = $id RETURN n.size"
			},
			function: {
				title: (node) => {
					return viz.nodeToHtml(node, undefined);
				}
			},
		}
	}
}
```

#### Index signature

▪ [label: `string`]: [`LabelConfig`](LabelConfig.md)

#### Type declaration

| Name | Type |
| :------ | :------ |
| `[NEOVIS_DEFAULT_CONFIG]?` | [`LabelConfig`](LabelConfig.md) |

#### Defined in

[src/neovis.ts:241](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L241)

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

• `Optional` **nonFlat**: ``false``

Tells Neovis is the config is flat or not

#### Overrides

[BaseNeovisConfig](BaseNeovisConfig.md).[nonFlat](BaseNeovisConfig.md#nonflat)

#### Defined in

[src/neovis.ts:220](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L220)

___

### relationships

• `Optional` **relationships**: `Object`

**`example`**
``` js
{
     INTERACTS: {
 	    value: 'weight',
 	    [Neovis.NEOVIS_ADVANCED_CONFIG]: {
 	    	function: {
 	    		title: (edge) => {
 	    			return viz.nodeToHtml(edge, undefined);
 	    		}
 	    	},
 	    }
     }
}
```

#### Index signature

▪ [relationship: `string`]: [`RelationshipConfig`](RelationshipConfig.md)

#### Type declaration

| Name | Type |
| :------ | :------ |
| `[NEOVIS_DEFAULT_CONFIG]?` | [`RelationshipConfig`](RelationshipConfig.md) |

#### Defined in

[src/neovis.ts:262](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L262)

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
