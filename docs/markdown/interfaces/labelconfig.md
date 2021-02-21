[neovis.js](../README.md) / LabelConfig

# Interface: LabelConfig

A mapper between neo4j node properties names to vis-network node config

**`link`** https://visjs.github.io/vis-network/docs/network/nodes.html

## Hierarchy

* [*RecursiveMapTo*](../README.md#recursivemapto)<VisNetwork.Node, string\>

  ↳ **LabelConfig**

## Table of contents

### Properties

- [[NEOVIS\_ADVANCED\_CONFIG]](labelconfig.md#[neovis_advanced_config])
- [borderWidth](labelconfig.md#borderwidth)
- [borderWidthSelected](labelconfig.md#borderwidthselected)
- [brokenImage](labelconfig.md#brokenimage)
- [chosen](labelconfig.md#chosen)
- [color](labelconfig.md#color)
- [fixed](labelconfig.md#fixed)
- [font](labelconfig.md#font)
- [group](labelconfig.md#group)
- [hidden](labelconfig.md#hidden)
- [icon](labelconfig.md#icon)
- [id](labelconfig.md#id)
- [image](labelconfig.md#image)
- [imagePadding](labelconfig.md#imagepadding)
- [label](labelconfig.md#label)
- [labelHighlightBold](labelconfig.md#labelhighlightbold)
- [level](labelconfig.md#level)
- [margin](labelconfig.md#margin)
- [mass](labelconfig.md#mass)
- [opacity](labelconfig.md#opacity)
- [physics](labelconfig.md#physics)
- [scaling](labelconfig.md#scaling)
- [shadow](labelconfig.md#shadow)
- [shape](labelconfig.md#shape)
- [shapeProperties](labelconfig.md#shapeproperties)
- [size](labelconfig.md#size)
- [title](labelconfig.md#title)
- [value](labelconfig.md#value)
- [widthConstraint](labelconfig.md#widthconstraint)
- [x](labelconfig.md#x)
- [y](labelconfig.md#y)

## Properties

### [NEOVIS\_ADVANCED\_CONFIG]

• `Optional` **[NEOVIS\_ADVANCED\_CONFIG]**: [*NeoVisAdvanceConfig*](neovisadvanceconfig.md)<Node, Node<number\>\>

advance options which allow for:
mapping static options to each node
mapping cypher to run for each node to determine vis-network node option
mapping function that gets the neo4j node and returns vis-network node option

Defined in: [index.d.ts:64](https://github.com/thebestnom/neovis.js/blob/d41808e/index.d.ts#L64)

___

### borderWidth

• `Optional` **borderWidth**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:897

___

### borderWidthSelected

• `Optional` **borderWidthSelected**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:899

___

### brokenImage

• `Optional` **brokenImage**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:901

___

### chosen

• `Optional` **chosen**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:905

___

### color

• `Optional` **color**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:903

___

### fixed

• `Optional` **fixed**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:909

___

### font

• `Optional` **font**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:914

___

### group

• `Optional` **group**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:916

___

### hidden

• `Optional` **hidden**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:918

___

### icon

• `Optional` **icon**: [*RecursiveMapTo*](../README.md#recursivemapto)<{ `code?`: *string* ; `color?`: *string* ; `face?`: *string* ; `size?`: *number* ; `weight?`: IdType  }, string\>

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:920

___

### id

• `Optional` **id**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:760

___

### image

• `Optional` **image**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:928

___

### imagePadding

• `Optional` **imagePadding**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:930

___

### label

• `Optional` **label**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:932

___

### labelHighlightBold

• `Optional` **labelHighlightBold**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:934

___

### level

• `Optional` **level**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:936

___

### margin

• `Optional` **margin**: [*RecursiveMapTo*](../README.md#recursivemapto)<{ `bottom?`: *number* ; `left?`: *number* ; `right?`: *number* ; `top?`: *number*  }, string\>

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:938

___

### mass

• `Optional` **mass**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:945

___

### opacity

• `Optional` **opacity**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:907

___

### physics

• `Optional` **physics**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:947

___

### scaling

• `Optional` **scaling**: [*RecursiveMapTo*](../README.md#recursivemapto)<OptionsScaling, string\>

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:949

___

### shadow

• `Optional` **shadow**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:951

___

### shape

• `Optional` **shape**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:953

___

### shapeProperties

• `Optional` **shapeProperties**: [*RecursiveMapTo*](../README.md#recursivemapto)<{ `borderDashes?`: *boolean* \| *number*[] ; `borderRadius?`: *number* ; `coordinateOrigin?`: *string* ; `interpolation?`: *boolean* ; `useBorderWithImage?`: *boolean* ; `useImageSize?`: *boolean*  }, string\>

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:955

___

### size

• `Optional` **size**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:964

___

### title

• `Optional` **title**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:966

___

### value

• `Optional` **value**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:968

___

### widthConstraint

• `Optional` **widthConstraint**: *string*

If false, no widthConstraint is applied. If a number is specified, the minimum and maximum widths of the node are set to the value.
The node's label's lines will be broken on spaces to stay below the maximum and the node's width
will be set to the minimum if less than the value.

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:975

___

### x

• `Optional` **x**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:977

___

### y

• `Optional` **y**: *string*

Defined in: node_modules/vis-network/declarations/network/Network.d.ts:979
