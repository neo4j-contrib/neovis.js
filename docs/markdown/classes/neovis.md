[neovis.js](../README.md) / NeoVis

# Class: NeoVis

## Table of contents

### Constructors

- [constructor](NeoVis.md#constructor)

### Accessors

- [edges](NeoVis.md#edges)
- [network](NeoVis.md#network)
- [nodes](NeoVis.md#nodes)

### Methods

- [clearNetwork](NeoVis.md#clearnetwork)
- [registerOnEvent](NeoVis.md#registeronevent)
- [reinit](NeoVis.md#reinit)
- [reload](NeoVis.md#reload)
- [render](NeoVis.md#render)
- [renderWithCypher](NeoVis.md#renderwithcypher)
- [stabilize](NeoVis.md#stabilize)
- [updateWithCypher](NeoVis.md#updatewithcypher)

## Constructors

### constructor

• **new NeoVis**(`config`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`NeovisConfig`](../interfaces/NeovisConfig.md) \| [`NonFlatNeovisConfig`](../interfaces/NonFlatNeovisConfig.md) | configures the visualization and Neo4j server connection |

#### Defined in

[src/neovis.ts:89](https://github.com/thebestnom/neovis.js/blob/2344f9f/src/neovis.ts#L89)

## Accessors

### edges

• `get` **edges**(): `DataSet`<[`Edge`](../interfaces/Edge.md), ``"id"``\>

All view edges as DataSet

**`link`** https://visjs.github.io/vis-data/data/dataset.html

#### Returns

`DataSet`<[`Edge`](../interfaces/Edge.md), ``"id"``\>

#### Defined in

[src/neovis.ts:65](https://github.com/thebestnom/neovis.js/blob/2344f9f/src/neovis.ts#L65)

___

### network

• `get` **network**(): `Network`

The vis network object

**`link`** https://visjs.github.io/vis-network/docs/network/#methods

#### Returns

`Network`

#### Defined in

[src/neovis.ts:80](https://github.com/thebestnom/neovis.js/blob/2344f9f/src/neovis.ts#L80)

___

### nodes

• `get` **nodes**(): `DataSet`<[`Node`](../interfaces/Node.md), ``"id"``\>

All view nodes as DataSet

**`link`** https://visjs.github.io/vis-data/data/dataset.html

#### Returns

`DataSet`<[`Node`](../interfaces/Node.md), ``"id"``\>

#### Defined in

[src/neovis.ts:57](https://github.com/thebestnom/neovis.js/blob/2344f9f/src/neovis.ts#L57)

## Methods

### clearNetwork

▸ **clearNetwork**(): `void`

Clear the data for the visualization

#### Returns

`void`

#### Defined in

[src/neovis.ts:477](https://github.com/thebestnom/neovis.js/blob/2344f9f/src/neovis.ts#L477)

___

### registerOnEvent

▸ **registerOnEvent**<`T`\>(`eventType`, `handler`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`NeoVisEvents`](../enums/NeoVisEvents.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventType` | `T` | Event type to be handled |
| `handler` | [`EventFunctionTypes`](../interfaces/EventFunctionTypes.md)[`T`] | Handler to manage the event |

#### Returns

`void`

#### Defined in

[src/neovis.ts:488](https://github.com/thebestnom/neovis.js/blob/2344f9f/src/neovis.ts#L488)

___

### reinit

▸ **reinit**(`config`): `void`

Reset the config object and reload data

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`NeovisConfig`](../interfaces/NeovisConfig.md) \| [`NonFlatNeovisConfig`](../interfaces/NonFlatNeovisConfig.md) |

#### Returns

`void`

#### Defined in

[src/neovis.ts:497](https://github.com/thebestnom/neovis.js/blob/2344f9f/src/neovis.ts#L497)

___

### reload

▸ **reload**(): `void`

Clear the network and fetch live data form the server and reload the visualization

#### Returns

`void`

#### Defined in

[src/neovis.ts:505](https://github.com/thebestnom/neovis.js/blob/2344f9f/src/neovis.ts#L505)

___

### render

▸ **render**(`query?`): `void`

Renders the network

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | `string` |

#### Returns

`void`

#### Defined in

[src/neovis.ts:360](https://github.com/thebestnom/neovis.js/blob/2344f9f/src/neovis.ts#L360)

___

### renderWithCypher

▸ **renderWithCypher**(`query`): `void`

Execute an arbitrary Cypher query and re-render the visualization

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `string` |

#### Returns

`void`

#### Defined in

[src/neovis.ts:522](https://github.com/thebestnom/neovis.js/blob/2344f9f/src/neovis.ts#L522)

___

### stabilize

▸ **stabilize**(): `void`

Stabilize the visualization

#### Returns

`void`

#### Defined in

[src/neovis.ts:513](https://github.com/thebestnom/neovis.js/blob/2344f9f/src/neovis.ts#L513)

___

### updateWithCypher

▸ **updateWithCypher**(`query`): `void`

Execute an arbitrary Cypher query and update the current visualization, retaning current nodes
This function will not change the original query given by renderWithCypher or the inital cypher.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `string` |

#### Returns

`void`

#### Defined in

[src/neovis.ts:534](https://github.com/thebestnom/neovis.js/blob/2344f9f/src/neovis.ts#L534)
