[neovis.js](../README.md) / NeovisConfig

# Interface: NeovisConfig

**`example`**
```js
//simple
{
     containerId: "viz",
     neo4j: {
     	serverUrl: "bolt://localhost:7687",
     	serverUser: "neo4j",
     	serverPassword: "sorts-swims-burglaries"
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
     initialCypher: "MATCH (n)-[r:INTERACTS]->(m) RETURN n,r,m"
}
// advance
{
     containerId: 'viz',
     neo4j: {
     	serverUrl: 'bolt://localhost:7687',
     	serverUser: 'neo4j',
     	serverPassword: 'gland-presentation-worry'
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
     initialCypher: 'MATCH (n)-[r]->(m) RETURN n,r,m'
}
```

## Hierarchy

- [`BaseNeovisConfig`](BaseNeovisConfig.md)

  ↳ **`NeovisConfig`**

## Table of contents

### Properties

- [consoleDebug](NeovisConfig.md#consoledebug)
- [containerId](NeovisConfig.md#containerid)
- [initialCypher](NeovisConfig.md#initialcypher)
- [labels](NeovisConfig.md#labels)
- [neo4j](NeovisConfig.md#neo4j)
- [nonFlat](NeovisConfig.md#nonflat)
- [relationships](NeovisConfig.md#relationships)
- [serverDatabase](NeovisConfig.md#serverdatabase)
- [visConfig](NeovisConfig.md#visconfig)

## Properties

### consoleDebug

• `Optional` **consoleDebug**: `boolean`

Should output debug messages to console

**`default`** false

#### Inherited from

[BaseNeovisConfig](BaseNeovisConfig.md).[consoleDebug](BaseNeovisConfig.md#consoledebug)

#### Defined in

[src/types.ts:128](https://github.com/thebestnom/neovis.js/blob/441899a/src/types.ts#L128)

___

### containerId

• **containerId**: `string`

Html id of the element you want Neovis to render on

#### Inherited from

[BaseNeovisConfig](BaseNeovisConfig.md).[containerId](BaseNeovisConfig.md#containerid)

#### Defined in

[src/types.ts:104](https://github.com/thebestnom/neovis.js/blob/441899a/src/types.ts#L104)

___

### initialCypher

• `Optional` **initialCypher**: `string`

The Cypher query that will get the data

#### Inherited from

[BaseNeovisConfig](BaseNeovisConfig.md).[initialCypher](BaseNeovisConfig.md#initialcypher)

#### Defined in

[src/types.ts:123](https://github.com/thebestnom/neovis.js/blob/441899a/src/types.ts#L123)

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

[src/types.ts:235](https://github.com/thebestnom/neovis.js/blob/441899a/src/types.ts#L235)

___

### neo4j

• `Optional` **neo4j**: `Driver` \| [`Neo4jConfig`](Neo4jConfig.md)

Neo4j Driver instance or configuration to make one

#### Inherited from

[BaseNeovisConfig](BaseNeovisConfig.md).[neo4j](BaseNeovisConfig.md#neo4j)

#### Defined in

[src/types.ts:113](https://github.com/thebestnom/neovis.js/blob/441899a/src/types.ts#L113)

___

### nonFlat

• `Optional` **nonFlat**: ``false``

Tells Neovis is the config is flat or not

#### Overrides

[BaseNeovisConfig](BaseNeovisConfig.md).[nonFlat](BaseNeovisConfig.md#nonflat)

#### Defined in

[src/types.ts:214](https://github.com/thebestnom/neovis.js/blob/441899a/src/types.ts#L214)

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

[src/types.ts:256](https://github.com/thebestnom/neovis.js/blob/441899a/src/types.ts#L256)

___

### serverDatabase

• `Optional` **serverDatabase**: `string`

database name you want to connect to

**`default`** neo4j

#### Inherited from

[BaseNeovisConfig](BaseNeovisConfig.md).[serverDatabase](BaseNeovisConfig.md#serverdatabase)

#### Defined in

[src/types.ts:109](https://github.com/thebestnom/neovis.js/blob/441899a/src/types.ts#L109)

___

### visConfig

• `Optional` **visConfig**: `Options`

Vis network config to override neovis defaults

**`link`** https://visjs.github.io/vis-network/docs/network/#options

#### Inherited from

[BaseNeovisConfig](BaseNeovisConfig.md).[visConfig](BaseNeovisConfig.md#visconfig)

#### Defined in

[src/types.ts:118](https://github.com/thebestnom/neovis.js/blob/441899a/src/types.ts#L118)
