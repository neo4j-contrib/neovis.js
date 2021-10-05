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

[src/neovis.ts:957](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L957)

___

### console\_debug

• `Optional` **console\_debug**: `boolean`

#### Defined in

[src/neovis.ts:961](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L961)

___

### container\_id

• **container\_id**: `string`

#### Defined in

[src/neovis.ts:944](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L944)

___

### encrypted

• `Optional` **encrypted**: ``"ENCRYPTION_OFF"`` \| ``"ENCRYPTION_ON"``

#### Defined in

[src/neovis.ts:962](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L962)

___

### hierarchical

• `Optional` **hierarchical**: `boolean`

#### Defined in

[src/neovis.ts:958](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L958)

___

### hierarchical\_sort\_method

• `Optional` **hierarchical\_sort\_method**: ``"hubsize"`` \| ``"directed"``

#### Defined in

[src/neovis.ts:959](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L959)

___

### initial\_cypher

• `Optional` **initial\_cypher**: `string`

#### Defined in

[src/neovis.ts:960](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L960)

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

[src/neovis.ts:949](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L949)

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

[src/neovis.ts:953](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L953)

___

### server\_database

• **server\_database**: `string`

#### Defined in

[src/neovis.ts:948](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L948)

___

### server\_password

• **server\_password**: `string`

#### Defined in

[src/neovis.ts:947](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L947)

___

### server\_url

• **server\_url**: `string`

#### Defined in

[src/neovis.ts:945](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L945)

___

### server\_user

• **server\_user**: `string`

#### Defined in

[src/neovis.ts:946](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L946)

___

### trust

• `Optional` **trust**: ``"TRUST_ALL_CERTIFICATES"`` \| ``"TRUST_SYSTEM_CA_SIGNED_CERTIFICATES"``

#### Defined in

[src/neovis.ts:963](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L963)
