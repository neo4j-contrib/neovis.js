[neovis.js](../README.md) / Edge

# Interface: Edge

A network edge with raw neo4j relationship

## Hierarchy

* *Edge*

  ↳ **Edge**

## Table of contents

### Properties

- [arrowStrikethrough](edge.md#arrowstrikethrough)
- [arrows](edge.md#arrows)
- [chosen](edge.md#chosen)
- [color](edge.md#color)
- [dashes](edge.md#dashes)
- [font](edge.md#font)
- [from](edge.md#from)
- [hidden](edge.md#hidden)
- [hoverWidth](edge.md#hoverwidth)
- [id](edge.md#id)
- [label](edge.md#label)
- [labelHighlightBold](edge.md#labelhighlightbold)
- [length](edge.md#length)
- [physics](edge.md#physics)
- [raw](edge.md#raw)
- [scaling](edge.md#scaling)
- [selectionWidth](edge.md#selectionwidth)
- [selfReference](edge.md#selfreference)
- [selfReferenceSize](edge.md#selfreferencesize)
- [shadow](edge.md#shadow)
- [smooth](edge.md#smooth)
- [title](edge.md#title)
- [to](edge.md#to)
- [value](edge.md#value)
- [width](edge.md#width)
- [widthConstraint](edge.md#widthconstraint)

## Properties

### arrowStrikethrough

• `Optional` **arrowStrikethrough**: *boolean*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:989

___

### arrows

• `Optional` **arrows**: *string* \| { `from?`: *boolean* \| ArrowHead ; `middle?`: *boolean* \| ArrowHead ; `to?`: *boolean* \| ArrowHead  }

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:983

___

### chosen

• `Optional` **chosen**: *boolean* \| { `edge?`: *boolean* ; `label?`: *boolean*  }

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:991

___

### color

• `Optional` **color**: *string* \| { `color?`: *string* ; `highlight?`: *string* ; `hover?`: *string* ; `inherit?`: *string* \| *boolean* ; `opacity?`: *number*  }

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:996

___

### dashes

• `Optional` **dashes**: *boolean* \| *number*[]

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1004

___

### font

• `Optional` **font**: *string* \| Font

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1006

___

### from

• `Optional` **from**: IdType

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:764

___

### hidden

• `Optional` **hidden**: *boolean*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1008

___

### hoverWidth

• `Optional` **hoverWidth**: *number*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1010

___

### id

• `Optional` **id**: IdType

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:766

___

### label

• `Optional` **label**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1012

___

### labelHighlightBold

• `Optional` **labelHighlightBold**: *boolean*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1014

___

### length

• `Optional` **length**: *number*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1016

___

### physics

• `Optional` **physics**: *boolean*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1018

___

### raw

• **raw**: *Relationship*<Integer\>

https://neo4j.com/docs/api/javascript-driver/current/class/src/graph-types.js~Relationship.html

Defined in: [index.d.ts:262](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L262)

___

### scaling

• `Optional` **scaling**: OptionsScaling

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1020

___

### selectionWidth

• `Optional` **selectionWidth**: *number*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1022

___

### selfReference

• `Optional` **selfReference**: *object*

#### Type declaration:

Name | Type |
:------ | :------ |
`angle`? | *number* |
`renderBehindTheNode`? | *boolean* |
`size`? | *number* |

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1026

___

### selfReferenceSize

• `Optional` **selfReferenceSize**: *number*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1024

___

### shadow

• `Optional` **shadow**: *boolean* \| OptionsShadow

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1032

___

### smooth

• `Optional` **smooth**: *boolean* \| { `enabled`: *boolean* ; `forceDirection?`: *string* \| *boolean* ; `roundness`: *number* ; `type`: *string*  }

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1034

___

### title

• `Optional` **title**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1041

___

### to

• `Optional` **to**: IdType

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:765

___

### value

• `Optional` **value**: *number*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1043

___

### width

• `Optional` **width**: *number*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1045

___

### widthConstraint

• `Optional` **widthConstraint**: *number* \| *boolean* \| { `maximum?`: *number*  }

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:1047
