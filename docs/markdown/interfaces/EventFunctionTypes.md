[neovis.js](../README.md) / EventFunctionTypes

# Interface: EventFunctionTypes

## Table of contents

### Methods

- [clickEdge](EventFunctionTypes.md#clickedge)
- [clickNode](EventFunctionTypes.md#clicknode)
- [completed](EventFunctionTypes.md#completed)
- [error](EventFunctionTypes.md#error)

## Methods

### clickEdge

▸ **clickEdge**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `Object` |
| `event.edge` | [`Edge`](Edge.md) |
| `event.edgeId` | `number` |

#### Returns

`void`

#### Defined in

[src/events.ts:13](https://github.com/thebestnom/neovis.js/blob/2890321/src/events.ts#L13)

___

### clickNode

▸ **clickNode**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `Object` |
| `event.node` | [`Node`](Node.md) |
| `event.nodeId` | `number` |

#### Returns

`void`

#### Defined in

[src/events.ts:12](https://github.com/thebestnom/neovis.js/blob/2890321/src/events.ts#L12)

___

### completed

▸ **completed**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `Object` |
| `event.recordCount` | `number` |

#### Returns

`void`

#### Defined in

[src/events.ts:11](https://github.com/thebestnom/neovis.js/blob/2890321/src/events.ts#L11)

___

### error

▸ **error**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `Object` |
| `event.error` | `Error` |

#### Returns

`void`

#### Defined in

[src/events.ts:14](https://github.com/thebestnom/neovis.js/blob/2890321/src/events.ts#L14)
