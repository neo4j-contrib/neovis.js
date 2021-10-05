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

[src/neovis.ts:51](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L51)

___

### function

• `Optional` **function**: [`RecursiveMapToFunction`](../README.md#recursivemaptofunction)<`VIS_TYPE`, `NEO_TYPE`\>

#### Defined in

[src/neovis.ts:52](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L52)

___

### static

• `Optional` **static**: `VIS_TYPE`

Static values that will the same for every node/relationship

#### Defined in

[src/neovis.ts:47](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L47)
