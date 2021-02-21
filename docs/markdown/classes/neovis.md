[neovis.js](../README.md) / Neovis

# Class: Neovis

## Table of contents

### Constructors

- [constructor](neovis.md#constructor)

### Accessors

- [edges](neovis.md#edges)
- [network](neovis.md#network)
- [nodes](neovis.md#nodes)

### Methods

- [clearNetwork](neovis.md#clearnetwork)
- [nodeToHtml](neovis.md#nodetohtml)
- [registerOnEvent](neovis.md#registeronevent)
- [reinit](neovis.md#reinit)
- [reload](neovis.md#reload)
- [render](neovis.md#render)
- [renderWithCypher](neovis.md#renderwithcypher)
- [stabilize](neovis.md#stabilize)
- [updateWithCypher](neovis.md#updatewithcypher)

## Constructors

### constructor

\+ **new Neovis**(`config`: [*NeovisConfig*](../interfaces/neovisconfig.md)): [*Neovis*](neovis.md)

#### Parameters:

Name | Type |
:------ | :------ |
`config` | [*NeovisConfig*](../interfaces/neovisconfig.md) |

**Returns:** [*Neovis*](neovis.md)

Defined in: [index.d.ts:265](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L265)

## Accessors

### edges

• get **edges**(): *DataSet*<[*Edge*](../interfaces/edge.md), *id*\>

All view edges as DataSet

**`link`** https://visjs.github.io/vis-data/data/dataset.html

**Returns:** *DataSet*<[*Edge*](../interfaces/edge.md), *id*\>

Defined in: [index.d.ts:278](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L278)

___

### network

• get **network**(): *Network*

The vis network object

**`link`** https://visjs.github.io/vis-network/docs/network/#methods

**Returns:** *Network*

Defined in: [index.d.ts:284](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L284)

___

### nodes

• get **nodes**(): *DataSet*<[*Node*](../interfaces/node.md), *id*\>

All view nodes as DataSet

**`link`** https://visjs.github.io/vis-data/data/dataset.html

**Returns:** *DataSet*<[*Node*](../interfaces/node.md), *id*\>

Defined in: [index.d.ts:272](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L272)

## Methods

### clearNetwork

▸ **clearNetwork**(): *void*

Clear the data for the visualization

**Returns:** *void*

Defined in: [index.d.ts:294](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L294)

___

### nodeToHtml

▸ **nodeToHtml**(`neo4jNode`: *Node*<Integer\>, `title_properties`: [*string*]): *string*

create html display of the node

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`neo4jNode` | *Node*<Integer\> | node to create html from   |
`title_properties` | [*string*] | which properties to map    |

**Returns:** *string*

Defined in: [index.d.ts:337](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L337)

___

### registerOnEvent

▸ **registerOnEvent**(`eventType`: [*NeoVisEvents*](../enums/neovisevents.md), `handler`: (`event`: *any*) => *void*): *void*

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`eventType` | [*NeoVisEvents*](../enums/neovisevents.md) | Event type to be handled   |
`handler` | (`event`: *any*) => *void* | Handler to manage the event    |

**Returns:** *void*

Defined in: [index.d.ts:301](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L301)

___

### reinit

▸ **reinit**(`config`: [*NeovisConfig*](../interfaces/neovisconfig.md)): *void*

Reset the config object and reload data

#### Parameters:

Name | Type |
:------ | :------ |
`config` | [*NeovisConfig*](../interfaces/neovisconfig.md) |

**Returns:** *void*

Defined in: [index.d.ts:307](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L307)

___

### reload

▸ **reload**(): *void*

Clear the network and fetch live data form the server and reload the visualization

**Returns:** *void*

Defined in: [index.d.ts:312](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L312)

___

### render

▸ **render**(): *void*

Renders the network

**Returns:** *void*

Defined in: [index.d.ts:289](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L289)

___

### renderWithCypher

▸ **renderWithCypher**(`query`: *string*): *void*

Execute an arbitrary Cypher query and re-render the visualization

#### Parameters:

Name | Type |
:------ | :------ |
`query` | *string* |

**Returns:** *void*

Defined in: [index.d.ts:323](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L323)

___

### stabilize

▸ **stabilize**(): *void*

Stabilize the visualization

**Returns:** *void*

Defined in: [index.d.ts:317](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L317)

___

### updateWithCypher

▸ **updateWithCypher**(`query`: *string*): *void*

Execute an arbitrary Cypher query and update the current visualization, retaning current nodes
This function will not change the original query given by renderWithCypher or the inital cypher.

#### Parameters:

Name | Type |
:------ | :------ |
`query` | *string* |

**Returns:** *void*

Defined in: [index.d.ts:330](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L330)
