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
     		[NeoVis.NEOVIS_ADVANCED_CONFIG]: {
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
     		[NeoVis.NEOVIS_ADVANCED_CONFIG]: {
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

## Table of contents

### Properties

- [console\_debug](neovisconfig.md#console_debug)
- [container\_id](neovisconfig.md#container_id)
- [initial\_cypher](neovisconfig.md#initial_cypher)
- [labels](neovisconfig.md#labels)
- [neo4j](neovisconfig.md#neo4j)
- [relationships](neovisconfig.md#relationships)
- [server\_database](neovisconfig.md#server_database)
- [visConfig](neovisconfig.md#visconfig)

## Properties

### console\_debug

• `Optional` **console\_debug**: *boolean*

Should output debug messages to console

**`default`** false

Defined in: [index.d.ts:242](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L242)

___

### container\_id

• **container\_id**: *string*

Html id of the element you want NeoVis to render on

Defined in: [index.d.ts:174](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L174)

___

### initial\_cypher

• `Optional` **initial\_cypher**: *string*

The Cypher query that will get the data

Defined in: [index.d.ts:237](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L237)

___

### labels

• `Optional` **labels**: *object*

**`example`** ```javascript
{
	Character: {
	label: 'pagerank',
		group: 'community',
		[NeoVis.NEOVIS_ADVANCED_CONFIG]: {
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

#### Type declaration:

Name | Type |
:------ | :------ |
`[NEOVIS_DEFAULT_CONFIG]`? | [*LabelConfig*](labelconfig.md) |

Defined in: [index.d.ts:209](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L209)

___

### neo4j

• **neo4j**: [*Neo4jConfig*](neo4jconfig.md) \| Driver

Neo4j Driver instance or configuration to make one

Defined in: [index.d.ts:183](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L183)

___

### relationships

• `Optional` **relationships**: *object*

**`example`** 
``` js
{
     INTERACTS: {
 	    value: 'weight',
 	    [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
 	    	function: {
 	    		title: (edge) => {
 	    			return viz.nodeToHtml(edge, undefined);
 	    		}
 	    	},
 	    }
     }
}
```

#### Type declaration:

Name | Type |
:------ | :------ |
`[NEOVIS_DEFAULT_CONFIG]`? | [*RelationshipConfig*](relationshipconfig.md) |

Defined in: [index.d.ts:230](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L230)

___

### server\_database

• **server\_database**: *string*

database name you want to connect to

**`default`** neo4j

Defined in: [index.d.ts:179](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L179)

___

### visConfig

• **visConfig**: Options

Vis network config to override neovis defaults

**`link`** https://visjs.github.io/vis-network/docs/network/#options

Defined in: [index.d.ts:188](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L188)
