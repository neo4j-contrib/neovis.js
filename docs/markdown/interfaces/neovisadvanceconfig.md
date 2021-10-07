[neovis.js](../README.md) / NeoVisAdvanceConfig

# Interface: NeoVisAdvanceConfig<VIS_TYPE, NEO_TYPE\>

## Type parameters

| Name |
| :------ |
| `VIS_TYPE` |
| `NEO_TYPE` |

## Hierarchy

- **`NeoVisAdvanceConfig`**

  ↳ [`NonFlatNeoVisAdvanceConfig`](NonFlatNeoVisAdvanceConfig.md)

## Table of contents

### Properties

- [cypher](NeoVisAdvanceConfig.md#cypher)
- [function](NeoVisAdvanceConfig.md#function)
- [static](NeoVisAdvanceConfig.md#static)

## Properties

### cypher

• `Optional` **cypher**: [`RecursiveMapTo`](../README.md#recursivemapto)<`VIS_TYPE`, `string`\>

Cypher that will be called for every object (will look the same as

#### Defined in

[src/types.ts:42](https://github.com/thebestnom/neovis.js/blob/2890321/src/types.ts#L42)

___

### function

• `Optional` **function**: [`RecursiveMapToFunction`](../README.md#recursivemaptofunction)<`VIS_TYPE`, `NEO_TYPE`\>

#### Defined in

[src/types.ts:43](https://github.com/thebestnom/neovis.js/blob/2890321/src/types.ts#L43)

___

### static

• `Optional` **static**: `VIS_TYPE`

Static values that will the same for every node/relationship

#### Defined in

[src/types.ts:38](https://github.com/thebestnom/neovis.js/blob/2890321/src/types.ts#L38)
