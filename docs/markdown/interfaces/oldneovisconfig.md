[neovis.js](../README.md) / OldNeoVisConfig

# Interface: OldNeoVisConfig

**`deprecated`** for migration only

## Table of contents

### Properties

- [arrows](OldNeoVisConfig.md#arrows)
- [console\_debug](OldNeoVisConfig.md#console_debug)
- [container\_id](OldNeoVisConfig.md#container_id)
- [encrypted](OldNeoVisConfig.md#encrypted)
- [hierarchical](OldNeoVisConfig.md#hierarchical)
- [hierarchical\_sort\_method](OldNeoVisConfig.md#hierarchical_sort_method)
- [initial\_cypher](OldNeoVisConfig.md#initial_cypher)
- [labels](OldNeoVisConfig.md#labels)
- [relationships](OldNeoVisConfig.md#relationships)
- [server\_database](OldNeoVisConfig.md#server_database)
- [server\_password](OldNeoVisConfig.md#server_password)
- [server\_url](OldNeoVisConfig.md#server_url)
- [server\_user](OldNeoVisConfig.md#server_user)
- [trust](OldNeoVisConfig.md#trust)

## Properties

### arrows

• `Optional` **arrows**: `boolean`

#### Defined in

[src/neovis.ts:636](https://github.com/thebestnom/neovis.js/blob/2890321/src/neovis.ts#L636)

___

### console\_debug

• `Optional` **console\_debug**: `boolean`

#### Defined in

[src/neovis.ts:640](https://github.com/thebestnom/neovis.js/blob/2890321/src/neovis.ts#L640)

___

### container\_id

• **container\_id**: `string`

#### Defined in

[src/neovis.ts:623](https://github.com/thebestnom/neovis.js/blob/2890321/src/neovis.ts#L623)

___

### encrypted

• `Optional` **encrypted**: ``"ENCRYPTION_OFF"`` \| ``"ENCRYPTION_ON"``

#### Defined in

[src/neovis.ts:641](https://github.com/thebestnom/neovis.js/blob/2890321/src/neovis.ts#L641)

___

### hierarchical

• `Optional` **hierarchical**: `boolean`

#### Defined in

[src/neovis.ts:637](https://github.com/thebestnom/neovis.js/blob/2890321/src/neovis.ts#L637)

___

### hierarchical\_sort\_method

• `Optional` **hierarchical\_sort\_method**: ``"hubsize"`` \| ``"directed"``

#### Defined in

[src/neovis.ts:638](https://github.com/thebestnom/neovis.js/blob/2890321/src/neovis.ts#L638)

___

### initial\_cypher

• `Optional` **initial\_cypher**: `string`

#### Defined in

[src/neovis.ts:639](https://github.com/thebestnom/neovis.js/blob/2890321/src/neovis.ts#L639)

___

### labels

• `Optional` **labels**: `Object`

#### Index signature

▪ [label: `string`]: [`OldLabelConfig`](OldLabelConfig.md)

#### Type declaration

| Name | Type |
| :------ | :------ |
| `[NEOVIS_DEFAULT_CONFIG]?` | [`OldLabelConfig`](OldLabelConfig.md) |

#### Defined in

[src/neovis.ts:628](https://github.com/thebestnom/neovis.js/blob/2890321/src/neovis.ts#L628)

___

### relationships

• `Optional` **relationships**: `Object`

#### Index signature

▪ [relationship: `string`]: [`OldRelationshipConfig`](OldRelationshipConfig.md)

#### Type declaration

| Name | Type |
| :------ | :------ |
| `[NEOVIS_DEFAULT_CONFIG]?` | [`OldRelationshipConfig`](OldRelationshipConfig.md) |

#### Defined in

[src/neovis.ts:632](https://github.com/thebestnom/neovis.js/blob/2890321/src/neovis.ts#L632)

___

### server\_database

• **server\_database**: `string`

#### Defined in

[src/neovis.ts:627](https://github.com/thebestnom/neovis.js/blob/2890321/src/neovis.ts#L627)

___

### server\_password

• **server\_password**: `string`

#### Defined in

[src/neovis.ts:626](https://github.com/thebestnom/neovis.js/blob/2890321/src/neovis.ts#L626)

___

### server\_url

• **server\_url**: `string`

#### Defined in

[src/neovis.ts:624](https://github.com/thebestnom/neovis.js/blob/2890321/src/neovis.ts#L624)

___

### server\_user

• **server\_user**: `string`

#### Defined in

[src/neovis.ts:625](https://github.com/thebestnom/neovis.js/blob/2890321/src/neovis.ts#L625)

___

### trust

• `Optional` **trust**: ``"TRUST_ALL_CERTIFICATES"`` \| ``"TRUST_SYSTEM_CA_SIGNED_CERTIFICATES"``

#### Defined in

[src/neovis.ts:642](https://github.com/thebestnom/neovis.js/blob/2890321/src/neovis.ts#L642)
