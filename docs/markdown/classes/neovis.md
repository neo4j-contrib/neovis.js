[neovis.js](../README.md) / NeoVis

# Class: NeoVis

## Table of contents

### Constructors

- [constructor](NeoVis.md#constructor)

### Properties

- [#config](NeoVis.md##config)
- [#container](NeoVis.md##container)
- [#data](NeoVis.md##data)
- [#database](NeoVis.md##database)
- [#driver](NeoVis.md##driver)
- [#events](NeoVis.md##events)
- [#network](NeoVis.md##network)
- [#query](NeoVis.md##query)

### Accessors

- [edges](NeoVis.md#edges)
- [network](NeoVis.md#network)
- [nodes](NeoVis.md#nodes)

### Methods

- [#buildCypherObject](NeoVis.md##buildcypherobject)
- [#buildEdgeVisObject](NeoVis.md##buildedgevisobject)
- [#buildFunctionObject](NeoVis.md##buildfunctionobject)
- [#buildNodeVisObject](NeoVis.md##buildnodevisobject)
- [#buildPropertyNameObject](NeoVis.md##buildpropertynameobject)
- [#buildStaticObject](NeoVis.md##buildstaticobject)
- [#buildVisObject](NeoVis.md##buildvisobject)
- [#consoleLog](NeoVis.md##consolelog)
- [#init](NeoVis.md##init)
- [#runCypher](NeoVis.md##runcypher)
- [#runFunction](NeoVis.md##runfunction)
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

[src/neovis.ts:412](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L412)

## Properties

### #config

• `Private` **#config**: [`NeovisConfig`](../interfaces/NeovisConfig.md) \| [`NonFlatNeovisConfig`](../interfaces/NonFlatNeovisConfig.md)

#### Defined in

[src/neovis.ts:370](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L370)

___

### #container

• `Private` **#container**: `HTMLElement`

#### Defined in

[src/neovis.ts:374](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L374)

___

### #data

• `Private` **#data**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `edges` | `DataSet`<[`Edge`](../interfaces/Edge.md), ``"id"``\> |
| `nodes` | `DataSet`<[`Node`](../interfaces/Node.md), ``"id"``\> |

#### Defined in

[src/neovis.ts:364](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L364)

___

### #database

• `Private` **#database**: `string`

#### Defined in

[src/neovis.ts:372](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L372)

___

### #driver

• `Private` **#driver**: `Driver`

#### Defined in

[src/neovis.ts:371](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L371)

___

### #events

• `Private` **#events**: `EventController`

#### Defined in

[src/neovis.ts:369](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L369)

___

### #network

• `Private` **#network**: `Network` = `null`

#### Defined in

[src/neovis.ts:368](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L368)

___

### #query

• `Private` **#query**: `string`

#### Defined in

[src/neovis.ts:373](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L373)

## Accessors

### edges

• `get` **edges**(): `DataSet`<[`Edge`](../interfaces/Edge.md), ``"id"``\>

All view edges as DataSet

**`link`** https://visjs.github.io/vis-data/data/dataset.html

#### Returns

`DataSet`<[`Edge`](../interfaces/Edge.md), ``"id"``\>

#### Defined in

[src/neovis.ts:388](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L388)

___

### network

• `get` **network**(): `Network`

The vis network object

**`link`** https://visjs.github.io/vis-network/docs/network/#methods

#### Returns

`Network`

#### Defined in

[src/neovis.ts:403](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L403)

___

### nodes

• `get` **nodes**(): `DataSet`<[`Node`](../interfaces/Node.md), ``"id"``\>

All view nodes as DataSet

**`link`** https://visjs.github.io/vis-data/data/dataset.html

#### Returns

`DataSet`<[`Node`](../interfaces/Node.md), ``"id"``\>

#### Defined in

[src/neovis.ts:380](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L380)

## Methods

### #buildCypherObject

▸ `Private` **#buildCypherObject**<`VIS_TYPE`\>(`cypherConfig`, `object`, `id`): `Promise`<`void`\>

#### Type parameters

| Name |
| :------ |
| `VIS_TYPE` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `cypherConfig` | [`RecursiveMapTo`](../README.md#recursivemapto)<`VIS_TYPE`, `string`\> |
| `object` | [`Node`](../interfaces/Node.md) \| [`Edge`](../interfaces/Edge.md) |
| `id` | `number` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/neovis.ts:570](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L570)

___

### #buildEdgeVisObject

▸ `Private` **#buildEdgeVisObject**(`r`): `Promise`<`Partial`<[`Edge`](../interfaces/Edge.md)\>\>

Build edge object for vis from a neo4j Relationship

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `Relationship`<`NumberOrInteger`\> |

#### Returns

`Promise`<`Partial`<[`Edge`](../interfaces/Edge.md)\>\>

#### Defined in

[src/neovis.ts:665](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L665)

___

### #buildFunctionObject

▸ `Private` **#buildFunctionObject**<`VIS_TYPE`, `NEO_TYPE`\>(`functionConfig`, `object`, `neo4jObj`): `Promise`<`void`\>

#### Type parameters

| Name |
| :------ |
| `VIS_TYPE` |
| `NEO_TYPE` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionConfig` | [`RecursiveMapToFunction`](../README.md#recursivemaptofunction)<`VIS_TYPE`, `NEO_TYPE`\> |
| `object` | [`Node`](../interfaces/Node.md) \| [`Edge`](../interfaces/Edge.md) |
| `neo4jObj` | `NEO_TYPE` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/neovis.ts:586](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L586)

___

### #buildNodeVisObject

▸ `Private` **#buildNodeVisObject**(`neo4jNode`): `Promise`<`Partial`<[`Node`](../interfaces/Node.md)\>\>

Build node object for vis from a neo4j Node

#### Parameters

| Name | Type |
| :------ | :------ |
| `neo4jNode` | `Node`<`NumberOrInteger`\> |

#### Returns

`Promise`<`Partial`<[`Node`](../interfaces/Node.md)\>\>

#### Defined in

[src/neovis.ts:644](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L644)

___

### #buildPropertyNameObject

▸ `Private` **#buildPropertyNameObject**<`VIS_TYPE`, `NEO_TYPE`\>(`propertyNameConfig`, `object`, `neo4jObj`): `void`

#### Type parameters

| Name |
| :------ |
| `VIS_TYPE` |
| `NEO_TYPE` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `propertyNameConfig` | [`RecursiveMapTo`](../README.md#recursivemapto)<`VIS_TYPE`, `string`\> |
| `object` | [`Node`](../interfaces/Node.md) \| [`Edge`](../interfaces/Edge.md) |
| `neo4jObj` | `NEO_TYPE` |

#### Returns

`void`

#### Defined in

[src/neovis.ts:553](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L553)

___

### #buildStaticObject

▸ `Private` **#buildStaticObject**<`VIS_TYPE`\>(`staticConfig`, `object`): `void`

#### Type parameters

| Name |
| :------ |
| `VIS_TYPE` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `staticConfig` | `VIS_TYPE` |
| `object` | [`Node`](../interfaces/Node.md) \| [`Edge`](../interfaces/Edge.md) |

#### Returns

`void`

#### Defined in

[src/neovis.ts:537](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L537)

___

### #buildVisObject

▸ `Private` **#buildVisObject**<`VIS_TYPE`, `NEO_TYPE`\>(`config`, `baseObject`, `neo4jObject`): `Promise`<`void`\>

#### Type parameters

| Name |
| :------ |
| `VIS_TYPE` |
| `NEO_TYPE` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `NeovisDataConfig`<`VIS_TYPE`, `NEO_TYPE`\> \| [`NonFlatNeoVisAdvanceConfig`](../interfaces/NonFlatNeoVisAdvanceConfig.md)<`VIS_TYPE`, `NEO_TYPE`\> |
| `baseObject` | [`Node`](../interfaces/Node.md) \| [`Edge`](../interfaces/Edge.md) |
| `neo4jObject` | `any` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/neovis.ts:602](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L602)

___

### #consoleLog

▸ `Private` **#consoleLog**(`message`, `level?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `message` | `any` | `undefined` |
| `level` | `string` | `'log'` |

#### Returns

`void`

#### Defined in

[src/neovis.ts:419](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L419)

___

### #init

▸ `Private` **#init**(`config`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`NeovisConfig`](../interfaces/NeovisConfig.md) \| [`NonFlatNeovisConfig`](../interfaces/NonFlatNeovisConfig.md) |

#### Returns

`void`

#### Defined in

[src/neovis.ts:426](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L426)

___

### #runCypher

▸ `Private` **#runCypher**(`cypher`, `id`): `Promise`<`Record`<`Dict`<`PropertyKey`, `any`\>, `PropertyKey`, `Dict`<`string`, `number`\>\> \| `Record`<`Dict`<`PropertyKey`, `any`\>, `PropertyKey`, `Dict`<`string`, `number`\>\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cypher` | `string` |
| `id` | `number` |

#### Returns

`Promise`<`Record`<`Dict`<`PropertyKey`, `any`\>, `PropertyKey`, `Dict`<`string`, `number`\>\> \| `Record`<`Dict`<`PropertyKey`, `any`\>, `PropertyKey`, `Dict`<`string`, `number`\>\>[]\>

#### Defined in

[src/neovis.ts:506](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L506)

___

### #runFunction

▸ `Private` **#runFunction**<`NEO_TYPE`\>(`func`, `node`): `Promise`<`any`\>

#### Type parameters

| Name |
| :------ |
| `NEO_TYPE` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `func` | `Function` |
| `node` | `NEO_TYPE` |

#### Returns

`Promise`<`any`\>

#### Defined in

[src/neovis.ts:530](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L530)

___

### clearNetwork

▸ **clearNetwork**(): `void`

Clear the data for the visualization

#### Returns

`void`

#### Defined in

[src/neovis.ts:799](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L799)

___

### registerOnEvent

▸ **registerOnEvent**(`eventType`, `handler`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventType` | [`NeoVisEvents`](../enums/NeoVisEvents.md) | Event type to be handled |
| `handler` | `Function` | Handler to manage the event |

#### Returns

`void`

#### Defined in

[src/neovis.ts:810](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L810)

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

[src/neovis.ts:819](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L819)

___

### reload

▸ **reload**(): `void`

Clear the network and fetch live data form the server and reload the visualization

#### Returns

`void`

#### Defined in

[src/neovis.ts:827](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L827)

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

[src/neovis.ts:683](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L683)

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

[src/neovis.ts:844](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L844)

___

### stabilize

▸ **stabilize**(): `void`

Stabilize the visualization

#### Returns

`void`

#### Defined in

[src/neovis.ts:835](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L835)

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

[src/neovis.ts:856](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L856)
