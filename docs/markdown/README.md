neovis.js

# neovis.js

## Table of contents

### References

- [default](README.md#default)

### Enumerations

- [NeoVisEvents](enums/NeoVisEvents.md)

### Classes

- [NeoVis](classes/NeoVis.md)

### Interfaces

- [BaseNeovisConfig](interfaces/BaseNeovisConfig.md)
- [Edge](interfaces/Edge.md)
- [LabelConfig](interfaces/LabelConfig.md)
- [Neo4jConfig](interfaces/Neo4jConfig.md)
- [NeoVisAdvanceConfig](interfaces/NeoVisAdvanceConfig.md)
- [NeovisConfig](interfaces/NeovisConfig.md)
- [Node](interfaces/Node.md)
- [NonFlatNeoVisAdvanceConfig](interfaces/NonFlatNeoVisAdvanceConfig.md)
- [NonFlatNeovisConfig](interfaces/NonFlatNeovisConfig.md)
- [OldLabelConfig](interfaces/OldLabelConfig.md)
- [OldNeoVisConfig](interfaces/OldNeoVisConfig.md)
- [OldRelationshipConfig](interfaces/OldRelationshipConfig.md)
- [RelationshipConfig](interfaces/RelationshipConfig.md)

### Type aliases

- [Cypher](README.md#cypher)
- [RecursiveMapTo](README.md#recursivemapto)
- [RecursiveMapToFunction](README.md#recursivemaptofunction)

### Variables

- [NEOVIS\_ADVANCED\_CONFIG](README.md#neovis_advanced_config)
- [NEOVIS\_DEFAULT\_CONFIG](README.md#neovis_default_config)

### Functions

- [migrateFromOldConfig](README.md#migratefromoldconfig)
- [objectToTitleHtml](README.md#objecttotitlehtml)
- [objectToTitleString](README.md#objecttotitlestring)

## References

### default

Renames and re-exports [NeoVis](classes/NeoVis.md)

## Type aliases

### Cypher

Ƭ **Cypher**: `string`

Cypher quarry

#### Defined in

[src/neovis.ts:41](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L41)

___

### RecursiveMapTo

Ƭ **RecursiveMapTo**<`T`, `New`\>: { [P in keyof T]: T[P] extends object ? RecursiveMapTo<T[P], New\> : New }

Maps a type recursively and replace each non object type with the new type

**`param`** type to map

**`param`** type to map to for each non object type

#### Type parameters

| Name |
| :------ |
| `T` |
| `New` |

#### Defined in

[src/neovis.ts:24](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L24)

___

### RecursiveMapToFunction

Ƭ **RecursiveMapToFunction**<`T`, `PARAM_TYPE`\>: { [P in keyof T]: T[P] extends object ? Function \| RecursiveMapToFunction<T[P], PARAM\_TYPE\> : Function }

Maps a type recursively and adds the ability for each object property to be a function that returns the same type
but replace each non object type with a function that returns the same type

**`param`** type to map

**`param`** type of parameter the functions get

#### Type parameters

| Name |
| :------ |
| `T` |
| `PARAM_TYPE` |

#### Defined in

[src/neovis.ts:34](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L34)

## Variables

### NEOVIS\_ADVANCED\_CONFIG

• **NEOVIS\_ADVANCED\_CONFIG**: typeof [`NEOVIS_ADVANCED_CONFIG`](README.md#neovis_advanced_config)

#### Defined in

[src/neovis.ts:14](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L14)

___

### NEOVIS\_DEFAULT\_CONFIG

• **NEOVIS\_DEFAULT\_CONFIG**: typeof [`NEOVIS_DEFAULT_CONFIG`](README.md#neovis_default_config)

#### Defined in

[src/neovis.ts:13](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L13)

## Functions

### migrateFromOldConfig

▸ **migrateFromOldConfig**(`oldNeoVisConfig`): [`NeovisConfig`](interfaces/NeovisConfig.md)

**`deprecated`** will be removed in the future
migrate old config to the new one

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `oldNeoVisConfig` | [`OldNeoVisConfig`](interfaces/OldNeoVisConfig.md) | 1.0.0 config object |

#### Returns

[`NeovisConfig`](interfaces/NeovisConfig.md)

#### Defined in

[src/neovis.ts:971](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L971)

___

### objectToTitleHtml

▸ **objectToTitleHtml**(`neo4jObject`, `titleProperties`): `HTMLDivElement`

create html display of the node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `neo4jObject` | `Node`<`NumberOrInteger`\> \| `Relationship`<`NumberOrInteger`\> | node to create html from |
| `titleProperties` | `string`[] | which properties to map |

#### Returns

`HTMLDivElement`

#### Defined in

[src/neovis.ts:884](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L884)

___

### objectToTitleString

▸ **objectToTitleString**(`neo4jObject`, `titleProperties`): `string`

create string display of the node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `neo4jObject` | `Node`<`NumberOrInteger`\> \| `Relationship`<`NumberOrInteger`\> | node to create title string from |
| `titleProperties` | `string`[] | which properties to map |

#### Returns

`string`

#### Defined in

[src/neovis.ts:905](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L905)
