[neovis.js](../README.md) / EventController

# Class: EventController

## Table of contents

### Constructors

- [constructor](EventController.md#constructor)

### Methods

- [generateEvent](EventController.md#generateevent)
- [register](EventController.md#register)

## Constructors

### constructor

• **new EventController**()

#### Defined in

[src/events.ts:20](https://github.com/thebestnom/neovis.js/blob/441899a/src/events.ts#L20)

## Methods

### generateEvent

▸ **generateEvent**<`T`\>(`eventType`, `values`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`NeoVisEvents`](../enums/NeoVisEvents.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventType` | `T` | Type of the event generated |
| `values` | `Parameters`<[`EventFunctionTypes`](../interfaces/EventFunctionTypes.md)[`T`]\>[``0``] | Values associated to the event |

#### Returns

`void`

#### Defined in

[src/events.ts:47](https://github.com/thebestnom/neovis.js/blob/441899a/src/events.ts#L47)

___

### register

▸ **register**<`T`\>(`eventType`, `handler`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`NeoVisEvents`](../enums/NeoVisEvents.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventType` | `T` | Type of the event to be handled |
| `handler` | [`EventFunctionTypes`](../interfaces/EventFunctionTypes.md)[`T`] | Handler to manage the event |

#### Returns

`void`

#### Defined in

[src/events.ts:34](https://github.com/thebestnom/neovis.js/blob/441899a/src/events.ts#L34)
