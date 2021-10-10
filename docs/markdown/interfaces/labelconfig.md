[neovis.js](../README.md) / LabelConfig

# Interface: LabelConfig

A mapper between neo4j node properties names to vis-network node config

**`link`** https://visjs.github.io/vis-network/docs/network/nodes.html

## Hierarchy

- [`RecursiveMapTo`](../README.md#recursivemapto)<`VisNetwork.Node`, `string`\>

  ↳ **`LabelConfig`**

## Table of contents

### Properties

- [[NEOVIS\_ADVANCED\_CONFIG]](LabelConfig.md#[neovis_advanced_config])
- [borderWidth](LabelConfig.md#borderwidth)
- [borderWidthSelected](LabelConfig.md#borderwidthselected)
- [brokenImage](LabelConfig.md#brokenimage)
- [chosen](LabelConfig.md#chosen)
- [color](LabelConfig.md#color)
- [fixed](LabelConfig.md#fixed)
- [font](LabelConfig.md#font)
- [group](LabelConfig.md#group)
- [hidden](LabelConfig.md#hidden)
- [icon](LabelConfig.md#icon)
- [id](LabelConfig.md#id)
- [image](LabelConfig.md#image)
- [imagePadding](LabelConfig.md#imagepadding)
- [label](LabelConfig.md#label)
- [labelHighlightBold](LabelConfig.md#labelhighlightbold)
- [level](LabelConfig.md#level)
- [margin](LabelConfig.md#margin)
- [mass](LabelConfig.md#mass)
- [opacity](LabelConfig.md#opacity)
- [physics](LabelConfig.md#physics)
- [scaling](LabelConfig.md#scaling)
- [shadow](LabelConfig.md#shadow)
- [shape](LabelConfig.md#shape)
- [shapeProperties](LabelConfig.md#shapeproperties)
- [size](LabelConfig.md#size)
- [title](LabelConfig.md#title)
- [value](LabelConfig.md#value)
- [widthConstraint](LabelConfig.md#widthconstraint)
- [x](LabelConfig.md#x)
- [y](LabelConfig.md#y)

## Properties

### [NEOVIS\_ADVANCED\_CONFIG]

• `Optional` **[NEOVIS\_ADVANCED\_CONFIG]**: [`NeoVisAdvanceConfig`](NeoVisAdvanceConfig.md)<`Node`, `Node`<`number`\>\>

advance options which allow for:
mapping static options to each node
mapping cypher to run for each node to determine vis-network node option
mapping function that gets the neo4j node and returns vis-network node option

#### Defined in

[src/types.ts:65](https://github.com/thebestnom/neovis.js/blob/441899a/src/types.ts#L65)

___

### borderWidth

• `Optional` **borderWidth**: `string`

#### Inherited from

RecursiveMapTo.borderWidth

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:897

___

### borderWidthSelected

• `Optional` **borderWidthSelected**: `string`

#### Inherited from

RecursiveMapTo.borderWidthSelected

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:899

___

### brokenImage

• `Optional` **brokenImage**: `string`

#### Inherited from

RecursiveMapTo.brokenImage

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:901

___

### chosen

• `Optional` **chosen**: `string` \| [`RecursiveMapTo`](../README.md#recursivemapto)<`NodeChosen`, `string`\>

#### Inherited from

RecursiveMapTo.chosen

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:905

___

### color

• `Optional` **color**: `string` \| [`RecursiveMapTo`](../README.md#recursivemapto)<`Color`, `string`\>

#### Inherited from

RecursiveMapTo.color

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:903

___

### fixed

• `Optional` **fixed**: `string` \| [`RecursiveMapTo`](../README.md#recursivemapto)<`Object`, `string`\>

#### Inherited from

RecursiveMapTo.fixed

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:909

___

### font

• `Optional` **font**: `string` \| [`RecursiveMapTo`](../README.md#recursivemapto)<`Font`, `string`\>

#### Inherited from

RecursiveMapTo.font

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:914

___

### group

• `Optional` **group**: `string`

#### Inherited from

RecursiveMapTo.group

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:916

___

### hidden

• `Optional` **hidden**: `string`

#### Inherited from

RecursiveMapTo.hidden

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:918

___

### icon

• `Optional` **icon**: [`RecursiveMapTo`](../README.md#recursivemapto)<`Object`, `string`\>

#### Inherited from

RecursiveMapTo.icon

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:920

___

### id

• `Optional` **id**: `string`

#### Inherited from

RecursiveMapTo.id

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:760

___

### image

• `Optional` **image**: `string` \| [`RecursiveMapTo`](../README.md#recursivemapto)<`Image`, `string`\>

#### Inherited from

RecursiveMapTo.image

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:928

___

### imagePadding

• `Optional` **imagePadding**: `string` \| [`RecursiveMapTo`](../README.md#recursivemapto)<`ImagePadding`, `string`\>

#### Inherited from

RecursiveMapTo.imagePadding

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:930

___

### label

• `Optional` **label**: `string`

#### Inherited from

RecursiveMapTo.label

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:932

___

### labelHighlightBold

• `Optional` **labelHighlightBold**: `string`

#### Inherited from

RecursiveMapTo.labelHighlightBold

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:934

___

### level

• `Optional` **level**: `string`

#### Inherited from

RecursiveMapTo.level

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:936

___

### margin

• `Optional` **margin**: [`RecursiveMapTo`](../README.md#recursivemapto)<`Object`, `string`\>

#### Inherited from

RecursiveMapTo.margin

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:938

___

### mass

• `Optional` **mass**: `string`

#### Inherited from

RecursiveMapTo.mass

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:945

___

### opacity

• `Optional` **opacity**: `string`

#### Inherited from

RecursiveMapTo.opacity

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:907

___

### physics

• `Optional` **physics**: `string`

#### Inherited from

RecursiveMapTo.physics

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:947

___

### scaling

• `Optional` **scaling**: [`RecursiveMapTo`](../README.md#recursivemapto)<`OptionsScaling`, `string`\>

#### Inherited from

RecursiveMapTo.scaling

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:949

___

### shadow

• `Optional` **shadow**: `string` \| [`RecursiveMapTo`](../README.md#recursivemapto)<`OptionsShadow`, `string`\>

#### Inherited from

RecursiveMapTo.shadow

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:951

___

### shape

• `Optional` **shape**: `string`

#### Inherited from

RecursiveMapTo.shape

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:953

___

### shapeProperties

• `Optional` **shapeProperties**: [`RecursiveMapTo`](../README.md#recursivemapto)<`Object`, `string`\>

#### Inherited from

RecursiveMapTo.shapeProperties

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:955

___

### size

• `Optional` **size**: `string`

#### Inherited from

RecursiveMapTo.size

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:964

___

### title

• `Optional` **title**: `string` \| [`RecursiveMapTo`](../README.md#recursivemapto)<`HTMLElement`, `string`\>

#### Inherited from

RecursiveMapTo.title

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:966

___

### value

• `Optional` **value**: `string`

#### Inherited from

RecursiveMapTo.value

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:968

___

### widthConstraint

• `Optional` **widthConstraint**: `string` \| [`RecursiveMapTo`](../README.md#recursivemapto)<`Object`, `string`\>

If false, no widthConstraint is applied. If a number is specified, the minimum and maximum widths of the node are set to the value.
The node's label's lines will be broken on spaces to stay below the maximum and the node's width
will be set to the minimum if less than the value.

#### Inherited from

RecursiveMapTo.widthConstraint

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:975

___

### x

• `Optional` **x**: `string`

#### Inherited from

RecursiveMapTo.x

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:977

___

### y

• `Optional` **y**: `string`

#### Inherited from

RecursiveMapTo.y

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:979
