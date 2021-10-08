[neovis.js](../README.md) / Node

# Interface: Node

A network node with raw neo4j node

## Hierarchy

- `Node`

  ↳ **`Node`**

## Table of contents

### Properties

- [borderWidth](Node.md#borderwidth)
- [borderWidthSelected](Node.md#borderwidthselected)
- [brokenImage](Node.md#brokenimage)
- [chosen](Node.md#chosen)
- [color](Node.md#color)
- [fixed](Node.md#fixed)
- [font](Node.md#font)
- [group](Node.md#group)
- [hidden](Node.md#hidden)
- [icon](Node.md#icon)
- [id](Node.md#id)
- [image](Node.md#image)
- [imagePadding](Node.md#imagepadding)
- [label](Node.md#label)
- [labelHighlightBold](Node.md#labelhighlightbold)
- [level](Node.md#level)
- [margin](Node.md#margin)
- [mass](Node.md#mass)
- [opacity](Node.md#opacity)
- [physics](Node.md#physics)
- [raw](Node.md#raw)
- [scaling](Node.md#scaling)
- [shadow](Node.md#shadow)
- [shape](Node.md#shape)
- [shapeProperties](Node.md#shapeproperties)
- [size](Node.md#size)
- [title](Node.md#title)
- [value](Node.md#value)
- [widthConstraint](Node.md#widthconstraint)
- [x](Node.md#x)
- [y](Node.md#y)

## Properties

### borderWidth

• `Optional` **borderWidth**: `number`

#### Inherited from

VisNetwork.Node.borderWidth

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:897

___

### borderWidthSelected

• `Optional` **borderWidthSelected**: `number`

#### Inherited from

VisNetwork.Node.borderWidthSelected

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:899

___

### brokenImage

• `Optional` **brokenImage**: `string`

#### Inherited from

VisNetwork.Node.brokenImage

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:901

___

### chosen

• `Optional` **chosen**: `boolean` \| `NodeChosen`

#### Inherited from

VisNetwork.Node.chosen

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:905

___

### color

• `Optional` **color**: `string` \| `Color`

#### Inherited from

VisNetwork.Node.color

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:903

___

### fixed

• `Optional` **fixed**: `boolean` \| { `x?`: `boolean` ; `y?`: `boolean`  }

#### Inherited from

VisNetwork.Node.fixed

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:909

___

### font

• `Optional` **font**: `string` \| `Font`

#### Inherited from

VisNetwork.Node.font

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:914

___

### group

• `Optional` **group**: `string`

#### Inherited from

VisNetwork.Node.group

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:916

___

### hidden

• `Optional` **hidden**: `boolean`

#### Inherited from

VisNetwork.Node.hidden

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:918

___

### icon

• `Optional` **icon**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `code?` | `string` |
| `color?` | `string` |
| `face?` | `string` |
| `size?` | `number` |
| `weight?` | `string` \| `number` |

#### Inherited from

VisNetwork.Node.icon

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:920

___

### id

• **id**: `number`

**`link`** https://neo4j.com/docs/api/javascript-driver/current/class/src/graph-types.js~Node.html

#### Overrides

VisNetwork.Node.id

#### Defined in

[src/types.ts:336](https://github.com/thebestnom/neovis.js/blob/2890321/src/types.ts#L336)

___

### image

• `Optional` **image**: `string` \| `Image`

#### Inherited from

VisNetwork.Node.image

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:928

___

### imagePadding

• `Optional` **imagePadding**: `number` \| `ImagePadding`

#### Inherited from

VisNetwork.Node.imagePadding

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:930

___

### label

• `Optional` **label**: `string`

#### Inherited from

VisNetwork.Node.label

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:932

___

### labelHighlightBold

• `Optional` **labelHighlightBold**: `boolean`

#### Inherited from

VisNetwork.Node.labelHighlightBold

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:934

___

### level

• `Optional` **level**: `number`

#### Inherited from

VisNetwork.Node.level

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:936

___

### margin

• `Optional` **margin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bottom?` | `number` |
| `left?` | `number` |
| `right?` | `number` |
| `top?` | `number` |

#### Inherited from

VisNetwork.Node.margin

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:938

___

### mass

• `Optional` **mass**: `number`

#### Inherited from

VisNetwork.Node.mass

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:945

___

### opacity

• `Optional` **opacity**: `number`

#### Inherited from

VisNetwork.Node.opacity

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:907

___

### physics

• `Optional` **physics**: `boolean`

#### Inherited from

VisNetwork.Node.physics

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:947

___

### raw

• **raw**: `Node`<[`NumberOrInteger`](../README.md#numberorinteger)\>

#### Defined in

[src/types.ts:337](https://github.com/thebestnom/neovis.js/blob/2890321/src/types.ts#L337)

___

### scaling

• `Optional` **scaling**: `OptionsScaling`

#### Inherited from

VisNetwork.Node.scaling

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:949

___

### shadow

• `Optional` **shadow**: `boolean` \| `OptionsShadow`

#### Inherited from

VisNetwork.Node.shadow

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:951

___

### shape

• `Optional` **shape**: `string`

#### Inherited from

VisNetwork.Node.shape

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:953

___

### shapeProperties

• `Optional` **shapeProperties**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `borderDashes?` | `boolean` \| `number`[] |
| `borderRadius?` | `number` |
| `coordinateOrigin?` | `string` |
| `interpolation?` | `boolean` |
| `useBorderWithImage?` | `boolean` |
| `useImageSize?` | `boolean` |

#### Inherited from

VisNetwork.Node.shapeProperties

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:955

___

### size

• `Optional` **size**: `number`

#### Inherited from

VisNetwork.Node.size

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:964

___

### title

• `Optional` **title**: `string` \| `HTMLElement`

#### Inherited from

VisNetwork.Node.title

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:966

___

### value

• `Optional` **value**: `number`

#### Inherited from

VisNetwork.Node.value

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:968

___

### widthConstraint

• `Optional` **widthConstraint**: `number` \| `boolean` \| { `maximum?`: `number` ; `minimum?`: `number`  }

If false, no widthConstraint is applied. If a number is specified, the minimum and maximum widths of the node are set to the value.
The node's label's lines will be broken on spaces to stay below the maximum and the node's width
will be set to the minimum if less than the value.

#### Inherited from

VisNetwork.Node.widthConstraint

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:975

___

### x

• `Optional` **x**: `number`

#### Inherited from

VisNetwork.Node.x

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:977

___

### y

• `Optional` **y**: `number`

#### Inherited from

VisNetwork.Node.y

#### Defined in

node_modules/vis-network/declarations/network/Network.d.ts:979
