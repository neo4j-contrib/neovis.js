[neovis.js](../README.md) / NeoVis

# Class: NeoVis

## Table of contents

### Constructors

- [constructor](neovis.md#constructor)

### Accessors

- [edges](neovis.md#edges)
- [network](neovis.md#network)
- [nodes](neovis.md#nodes)

### Methods

- [clearNetwork](neovis.md#clearnetwork)
- [registerOnEvent](neovis.md#registeronevent)
- [reinit](neovis.md#reinit)
- [reload](neovis.md#reload)
- [render](neovis.md#render)
- [renderWithCypher](neovis.md#renderwithcypher)
- [stabilize](neovis.md#stabilize)
- [updateWithCypher](neovis.md#updatewithcypher)

## Constructors

### constructor

\+ **new NeoVis**(`config`: [*NeovisConfig*](../interfaces/neovisconfig.md) \| [*NonFlatNeovisConfig*](../interfaces/nonflatneovisconfig.md)): [*NeoVis*](neovis.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [*NeovisConfig*](../interfaces/neovisconfig.md) \| [*NonFlatNeovisConfig*](../interfaces/nonflatneovisconfig.md) |

**Returns:** [*NeoVis*](neovis.md)

Defined in: [index.d.ts:345](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L345)

## Accessors

### edges

• get **edges**(): *DataSet*<[*Edge*](../interfaces/edge.md), ``"id"``\>

All view edges as DataSet

**`link`** https://visjs.github.io/vis-data/data/dataset.html

**Returns:** *DataSet*<[*Edge*](../interfaces/edge.md), ``"id"``\>

Defined in: [index.d.ts:358](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L358)

___

### network

• get **network**(): *Network*

The vis network object

**`link`** https://visjs.github.io/vis-network/docs/network/#methods

**Returns:** *Network*

Defined in: [index.d.ts:364](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L364)

___

### nodes

• get **nodes**(): *DataSet*<[*Node*](../interfaces/node.md), ``"id"``\>

All view nodes as DataSet

**`link`** https://visjs.github.io/vis-data/data/dataset.html

**Returns:** *DataSet*<[*Node*](../interfaces/node.md), ``"id"``\>

Defined in: [index.d.ts:352](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L352)

## Methods

### clearNetwork

▸ **clearNetwork**(): *void*

Clear the data for the visualization

**Returns:** *void*

Defined in: [index.d.ts:374](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L374)

___

### registerOnEvent

▸ **registerOnEvent**(`eventType`: [*NeoVisEvents*](../enums/neovisevents.md), `handler`: (`event`: *any*) => *void*): *void*

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventType` | [*NeoVisEvents*](../enums/neovisevents.md) | Event type to be handled |
| `handler` | (`event`: *any*) => *void* | Handler to manage the event |

**Returns:** *void*

Defined in: [index.d.ts:381](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L381)

___

### reinit

▸ **reinit**(`config`: [*NeovisConfig*](../interfaces/neovisconfig.md) \| [*NonFlatNeovisConfig*](../interfaces/nonflatneovisconfig.md)): *void*

Reset the config object and reload data

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [*NeovisConfig*](../interfaces/neovisconfig.md) \| [*NonFlatNeovisConfig*](../interfaces/nonflatneovisconfig.md) |

**Returns:** *void*

Defined in: [index.d.ts:387](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L387)

___

### reload

▸ **reload**(): *void*

Clear the network and fetch live data form the server and reload the visualization

**Returns:** *void*

Defined in: [index.d.ts:392](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L392)

___

### render

▸ **render**(): *void*

Renders the network

**Returns:** *void*

Defined in: [index.d.ts:369](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L369)

___

### renderWithCypher

▸ **renderWithCypher**(`query`: *string*): *void*

Execute an arbitrary Cypher query and re-render the visualization

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | *string* |

**Returns:** *void*

Defined in: [index.d.ts:403](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L403)

___

### stabilize

▸ **stabilize**(): *void*

Stabilize the visualization

**Returns:** *void*

Defined in: [index.d.ts:397](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L397)

___

### updateWithCypher

▸ **updateWithCypher**(`query`: *string*): *void*

Execute an arbitrary Cypher query and update the current visualization, retaning current nodes
This function will not change the original query given by renderWithCypher or the inital cypher.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | *string* |

**Returns:** *void*

Defined in: [index.d.ts:410](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L410)
