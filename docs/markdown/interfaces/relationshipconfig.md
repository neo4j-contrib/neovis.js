[neovis.js](../README.md) / RelationshipConfig

# Interface: RelationshipConfig

A mapper between neo4j relationship properties names to vis-network edge config

**`link`** https://visjs.github.io/vis-network/docs/network/edges.html

## Hierarchy

- [*RecursiveMapTo*](../README.md#recursivemapto)<VisNetwork.Edge, string\>

  ↳ **RelationshipConfig**

## Table of contents

### Properties

- [[NEOVIS\_ADVANCED\_CONFIG]](relationshipconfig.md#[neovis_advanced_config])
- [arrowStrikethrough](relationshipconfig.md#arrowstrikethrough)
- [arrows](relationshipconfig.md#arrows)
- [chosen](relationshipconfig.md#chosen)
- [color](relationshipconfig.md#color)
- [dashes](relationshipconfig.md#dashes)
- [font](relationshipconfig.md#font)
- [from](relationshipconfig.md#from)
- [hidden](relationshipconfig.md#hidden)
- [hoverWidth](relationshipconfig.md#hoverwidth)
- [id](relationshipconfig.md#id)
- [label](relationshipconfig.md#label)
- [labelHighlightBold](relationshipconfig.md#labelhighlightbold)
- [length](relationshipconfig.md#length)
- [physics](relationshipconfig.md#physics)
- [scaling](relationshipconfig.md#scaling)
- [selectionWidth](relationshipconfig.md#selectionwidth)
- [selfReference](relationshipconfig.md#selfreference)
- [selfReferenceSize](relationshipconfig.md#selfreferencesize)
- [shadow](relationshipconfig.md#shadow)
- [smooth](relationshipconfig.md#smooth)
- [title](relationshipconfig.md#title)
- [to](relationshipconfig.md#to)
- [value](relationshipconfig.md#value)
- [width](relationshipconfig.md#width)
- [widthConstraint](relationshipconfig.md#widthconstraint)

## Properties

### [NEOVIS\_ADVANCED\_CONFIG]

• `Optional` **[NEOVIS\_ADVANCED\_CONFIG]**: [*NeoVisAdvanceConfig*](neovisadvanceconfig.md)<Edge, Relationship<number\>\>

advance options which allow for:
mapping static options to each edge
mapping cypher to run for each relationship to determine vis-network edge option
mapping function that gets the neo4j relationship and returns vis-network edge option

Defined in: [index.d.ts:78](https://github.com/thebestnom/neovis.js/blob/689e3a9/index.d.ts#L78)

___

### arrowStrikethrough

• `Optional` **arrowStrikethrough**: *string*

Inherited from: RecursiveMapTo.arrowStrikethrough

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:989

___

### arrows

• `Optional` **arrows**: *string*

Inherited from: RecursiveMapTo.arrows

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:983

___

### chosen

• `Optional` **chosen**: *string*

Inherited from: RecursiveMapTo.chosen

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:991

___

### color

• `Optional` **color**: *string*

Inherited from: RecursiveMapTo.color

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:996

___

### dashes

• `Optional` **dashes**: *string*

Inherited from: RecursiveMapTo.dashes

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1004

___

### font

• `Optional` **font**: *string*

Inherited from: RecursiveMapTo.font

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1006

___

### from

• `Optional` **from**: *string*

Inherited from: RecursiveMapTo.from

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:764

___

### hidden

• `Optional` **hidden**: *string*

Inherited from: RecursiveMapTo.hidden

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1008

___

### hoverWidth

• `Optional` **hoverWidth**: *string*

Inherited from: RecursiveMapTo.hoverWidth

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1010

___

### id

• `Optional` **id**: *string*

Inherited from: RecursiveMapTo.id

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:766

___

### label

• `Optional` **label**: *string*

Inherited from: RecursiveMapTo.label

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1012

___

### labelHighlightBold

• `Optional` **labelHighlightBold**: *string*

Inherited from: RecursiveMapTo.labelHighlightBold

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1014

___

### length

• `Optional` **length**: *string*

Inherited from: RecursiveMapTo.length

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1016

___

### physics

• `Optional` **physics**: *string*

Inherited from: RecursiveMapTo.physics

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1018

___

### scaling

• `Optional` **scaling**: [*RecursiveMapTo*](../README.md#recursivemapto)<OptionsScaling, string\>

Inherited from: RecursiveMapTo.scaling

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1020

___

### selectionWidth

• `Optional` **selectionWidth**: *string*

Inherited from: RecursiveMapTo.selectionWidth

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1022

___

### selfReference

• `Optional` **selfReference**: [*RecursiveMapTo*](../README.md#recursivemapto)<{ `angle?`: *number* ; `renderBehindTheNode?`: *boolean* ; `size?`: *number*  }, string\>

Inherited from: RecursiveMapTo.selfReference

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1026

___

### selfReferenceSize

• `Optional` **selfReferenceSize**: *string*

Inherited from: RecursiveMapTo.selfReferenceSize

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1024

___

### shadow

• `Optional` **shadow**: *string*

Inherited from: RecursiveMapTo.shadow

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1032

___

### smooth

• `Optional` **smooth**: *string*

Inherited from: RecursiveMapTo.smooth

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1034

___

### title

• `Optional` **title**: *string*

Inherited from: RecursiveMapTo.title

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1041

___

### to

• `Optional` **to**: *string*

Inherited from: RecursiveMapTo.to

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:765

___

### value

• `Optional` **value**: *string*

Inherited from: RecursiveMapTo.value

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1043

___

### width

• `Optional` **width**: *string*

Inherited from: RecursiveMapTo.width

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1045

___

### widthConstraint

• `Optional` **widthConstraint**: *string*

Inherited from: RecursiveMapTo.widthConstraint

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1047
