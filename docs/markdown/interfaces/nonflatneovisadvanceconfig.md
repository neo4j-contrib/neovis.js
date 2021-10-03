[neovis.js](../README.md) / NonFlatNeoVisAdvanceConfig

# Interface: NonFlatNeoVisAdvanceConfig<VIS_TYPE, NEO_TYPE\>

## Type parameters

| Name |
| :------ |
| `VIS_TYPE` |
| `NEO_TYPE` |

## Hierarchy

- [*NeoVisAdvanceConfig*](neovisadvanceconfig.md)<VIS\_TYPE, NEO\_TYPE\>

  ↳ **NonFlatNeoVisAdvanceConfig**

## Table of contents

### Properties

- [cypher](nonflatneovisadvanceconfig.md#cypher)
- [function](nonflatneovisadvanceconfig.md#function)
- [property](nonflatneovisadvanceconfig.md#property)
- [static](nonflatneovisadvanceconfig.md#static)

## Properties

### cypher

• `Optional` **cypher**: [*RecursiveMapTo*](../README.md#recursivemapto)<VIS\_TYPE, string\>

Cypher that will be called for every object (will look the same as

Inherited from: [NeoVisAdvanceConfig](neovisadvanceconfig.md).[cypher](neovisadvanceconfig.md#cypher)

Defined in: [index.d.ts:49](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L49)

___

### function

• `Optional` **function**: [*RecursiveMapToFunction*](../README.md#recursivemaptofunction)<VIS\_TYPE, NEO\_TYPE\>

Inherited from: [NeoVisAdvanceConfig](neovisadvanceconfig.md).[function](neovisadvanceconfig.md#function)

Defined in: [index.d.ts:50](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L50)

___

### property

• `Optional` **property**: [*RecursiveMapTo*](../README.md#recursivemapto)<VIS\_TYPE, string\>

Defined in: [index.d.ts:54](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L54)

___

### static

• `Optional` **static**: VIS\_TYPE

Static values that will the same for every node/relationship

Inherited from: [NeoVisAdvanceConfig](neovisadvanceconfig.md).[static](neovisadvanceconfig.md#static)

Defined in: [index.d.ts:45](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L45)
