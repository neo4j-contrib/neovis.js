[neovis.js](../README.md) / NonFlatNeoVisAdvanceConfig

# Interface: NonFlatNeoVisAdvanceConfig<VIS_TYPE, NEO_TYPE\>

## Type parameters

| Name |
| :------ |
| `VIS_TYPE` |
| `NEO_TYPE` |

## Hierarchy

- [`NeoVisAdvanceConfig`](NeoVisAdvanceConfig.md)<`VIS_TYPE`, `NEO_TYPE`\>

  ↳ **`NonFlatNeoVisAdvanceConfig`**

## Table of contents

### Properties

- [cypher](NonFlatNeoVisAdvanceConfig.md#cypher)
- [function](NonFlatNeoVisAdvanceConfig.md#function)
- [property](NonFlatNeoVisAdvanceConfig.md#property)
- [static](NonFlatNeoVisAdvanceConfig.md#static)

## Properties

### cypher

• `Optional` **cypher**: [`RecursiveMapTo`](../README.md#recursivemapto)<`VIS_TYPE`, `string`\>

Cypher that will be called for every object (will look the same as

#### Inherited from

[NeoVisAdvanceConfig](NeoVisAdvanceConfig.md).[cypher](NeoVisAdvanceConfig.md#cypher)

#### Defined in

[src/types.ts:42](https://github.com/thebestnom/neovis.js/blob/2890321/src/types.ts#L42)

___

### function

• `Optional` **function**: [`RecursiveMapToFunction`](../README.md#recursivemaptofunction)<`VIS_TYPE`, `NEO_TYPE`\>

#### Inherited from

[NeoVisAdvanceConfig](NeoVisAdvanceConfig.md).[function](NeoVisAdvanceConfig.md#function)

#### Defined in

[src/types.ts:43](https://github.com/thebestnom/neovis.js/blob/2890321/src/types.ts#L43)

___

### property

• `Optional` **property**: [`RecursiveMapTo`](../README.md#recursivemapto)<`VIS_TYPE`, `string`\>

#### Defined in

[src/types.ts:47](https://github.com/thebestnom/neovis.js/blob/2890321/src/types.ts#L47)

___

### static

• `Optional` **static**: `VIS_TYPE`

Static values that will the same for every node/relationship

#### Inherited from

[NeoVisAdvanceConfig](NeoVisAdvanceConfig.md).[static](NeoVisAdvanceConfig.md#static)

#### Defined in

[src/types.ts:38](https://github.com/thebestnom/neovis.js/blob/2890321/src/types.ts#L38)
