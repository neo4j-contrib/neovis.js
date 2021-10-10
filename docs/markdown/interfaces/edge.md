[neovis.js](../README.md) / Edge

# Interface: Edge

A network edge with raw neo4j relationship

## Hierarchy

- `Edge`

  ↳ **`Edge`**

## Table of contents

### Properties

- [arrowStrikethrough](Edge.md#arrowstrikethrough)
- [arrows](Edge.md#arrows)
- [chosen](Edge.md#chosen)
- [color](Edge.md#color)
- [dashes](Edge.md#dashes)
- [font](Edge.md#font)
- [from](Edge.md#from)
- [hidden](Edge.md#hidden)
- [hoverWidth](Edge.md#hoverwidth)
- [id](Edge.md#id)
- [label](Edge.md#label)
- [labelHighlightBold](Edge.md#labelhighlightbold)
- [length](Edge.md#length)
- [physics](Edge.md#physics)
- [raw](Edge.md#raw)
- [scaling](Edge.md#scaling)
- [selectionWidth](Edge.md#selectionwidth)
- [selfReference](Edge.md#selfreference)
- [selfReferenceSize](Edge.md#selfreferencesize)
- [shadow](Edge.md#shadow)
- [smooth](Edge.md#smooth)
- [title](Edge.md#title)
- [to](Edge.md#to)
- [value](Edge.md#value)
- [width](Edge.md#width)
- [widthConstraint](Edge.md#widthconstraint)

## Properties

### arrowStrikethrough

• `Optional` **arrowStrikethrough**: `boolean`

#### Inherited from

VisNetwork.Edge.arrowStrikethrough

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:989

___

### arrows

• `Optional` **arrows**: `string` \| { `from?`: `boolean` \| `ArrowHead` ; `middle?`: `boolean` \| `ArrowHead` ; `to?`: `boolean` \| `ArrowHead`  }

#### Inherited from

VisNetwork.Edge.arrows

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:983

___

### chosen

• `Optional` **chosen**: `boolean` \| { `edge?`: `boolean` ; `label?`: `boolean`  }

#### Inherited from

VisNetwork.Edge.chosen

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:991

___

### color

• `Optional` **color**: `string` \| { `color?`: `string` ; `highlight?`: `string` ; `hover?`: `string` ; `inherit?`: `string` \| `boolean` ; `opacity?`: `number`  }

#### Inherited from

VisNetwork.Edge.color

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:996

___

### dashes

• `Optional` **dashes**: `boolean` \| `number`[]

#### Inherited from

VisNetwork.Edge.dashes

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:1004

___

### font

• `Optional` **font**: `string` \| `Font`

#### Inherited from

VisNetwork.Edge.font

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:1006

___

### from

• `Optional` **from**: `IdType`

#### Inherited from

VisNetwork.Edge.from

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:764

___

### hidden

• `Optional` **hidden**: `boolean`

#### Inherited from

VisNetwork.Edge.hidden

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:1008

___

### hoverWidth

• `Optional` **hoverWidth**: `number`

#### Inherited from

VisNetwork.Edge.hoverWidth

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:1010

___

### id

• **id**: `number`

https://neo4j.com/docs/api/javascript-driver/current/class/src/graph-types.js~Relationship.html

#### Overrides

VisNetwork.Edge.id

#### Defined in

[src/types.ts:347](https://github.com/thebestnom/neovis.js/blob/441899a/src/types.ts#L347)

___

### label

• `Optional` **label**: `string`

#### Inherited from

VisNetwork.Edge.label

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:1012

___

### labelHighlightBold

• `Optional` **labelHighlightBold**: `boolean`

#### Inherited from

VisNetwork.Edge.labelHighlightBold

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:1014

___

### length

• `Optional` **length**: `number`

#### Inherited from

VisNetwork.Edge.length

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:1016

___

### physics

• `Optional` **physics**: `boolean`

#### Inherited from

VisNetwork.Edge.physics

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:1018

___

### raw

• **raw**: `Relationship`<[`NumberOrInteger`](../README.md#numberorinteger)\>

#### Defined in

[src/types.ts:348](https://github.com/thebestnom/neovis.js/blob/441899a/src/types.ts#L348)

___

### scaling

• `Optional` **scaling**: `OptionsScaling`

#### Inherited from

VisNetwork.Edge.scaling

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:1020

___

### selectionWidth

• `Optional` **selectionWidth**: `number`

#### Inherited from

VisNetwork.Edge.selectionWidth

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:1022

___

### selfReference

• `Optional` **selfReference**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `angle?` | `number` |
| `renderBehindTheNode?` | `boolean` |
| `size?` | `number` |

#### Inherited from

VisNetwork.Edge.selfReference

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:1026

___

### selfReferenceSize

• `Optional` **selfReferenceSize**: `number`

#### Inherited from

VisNetwork.Edge.selfReferenceSize

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:1024

___

### shadow

• `Optional` **shadow**: `boolean` \| `OptionsShadow`

#### Inherited from

VisNetwork.Edge.shadow

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:1032

___

### smooth

• `Optional` **smooth**: `boolean` \| { `enabled`: `boolean` ; `forceDirection?`: `string` \| `boolean` ; `roundness`: `number` ; `type`: `string`  }

#### Inherited from

VisNetwork.Edge.smooth

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:1034

___

### title

• `Optional` **title**: `string` \| `HTMLElement`

#### Inherited from

VisNetwork.Edge.title

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:1041

___

### to

• `Optional` **to**: `IdType`

#### Inherited from

VisNetwork.Edge.to

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:765

___

### value

• `Optional` **value**: `number`

#### Inherited from

VisNetwork.Edge.value

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:1043

___

### width

• `Optional` **width**: `number`

#### Inherited from

VisNetwork.Edge.width

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:1045

___

### widthConstraint

• `Optional` **widthConstraint**: `number` \| `boolean` \| { `maximum?`: `number`  }

#### Inherited from

VisNetwork.Edge.widthConstraint

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:1047
