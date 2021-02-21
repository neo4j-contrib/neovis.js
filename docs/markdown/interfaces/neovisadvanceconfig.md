[neovis.js](../README.md) / NeoVisAdvanceConfig

# Interface: NeoVisAdvanceConfig<VIS_TYPE, NEO_TYPE\>

## Type parameters

Name |
:------ |
`VIS_TYPE` |
`NEO_TYPE` |

## Table of contents

### Properties

- [cypher](neovisadvanceconfig.md#cypher)
- [function](neovisadvanceconfig.md#function)
- [static](neovisadvanceconfig.md#static)

## Properties

### cypher

• `Optional` **cypher**: [*RecursiveMapTo*](../README.md#recursivemapto)<VIS\_TYPE, string\>

Cypher that will be called for every object (will look the same as

Defined in: [index.d.ts:49](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L49)

___

### function

• `Optional` **function**: [*RecursiveMapToFunction*](../README.md#recursivemaptofunction)<VIS\_TYPE, NEO\_TYPE\>

Defined in: [index.d.ts:50](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L50)

___

### static

• `Optional` **static**: VIS\_TYPE

Static values that will the same for every node/relationship

Defined in: [index.d.ts:45](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L45)
