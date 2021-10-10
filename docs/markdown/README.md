neovis.js

# neovis.js

## Table of contents

### References

- [default](README.md#default)

### Enumerations

- [NeoVisEvents](enums/NeoVisEvents.md)

### Classes

- [EventController](classes/EventController.md)
- [NeoVis](classes/NeoVis.md)

### Interfaces

- [BaseNeovisConfig](interfaces/BaseNeovisConfig.md)
- [Edge](interfaces/Edge.md)
- [EventFunctionTypes](interfaces/EventFunctionTypes.md)
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
- [NeovisDataConfig](README.md#neovisdataconfig)
- [NonFlatLabelConfig](README.md#nonflatlabelconfig)
- [NonFlatRelationsipConfig](README.md#nonflatrelationsipconfig)
- [NumberOrInteger](README.md#numberorinteger)
- [RecursiveMapTo](README.md#recursivemapto)
- [RecursiveMapToDist](README.md#recursivemaptodist)
- [RecursiveMapToFunction](README.md#recursivemaptofunction)
- [RecursiveMapToFunctionDist](README.md#recursivemaptofunctiondist)

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

[src/types.ts:32](https://github.com/thebestnom/neovis.js/blob/441899a/src/types.ts#L32)

___

### NeovisDataConfig

Ƭ **NeovisDataConfig**<`VIS_TYPE`, `NEO_TYPE`\>: [`RecursiveMapTo`](README.md#recursivemapto)<`VIS_TYPE`, `string`\> & { `[NEOVIS_ADVANCED_CONFIG]?`: [`NeoVisAdvanceConfig`](interfaces/NeoVisAdvanceConfig.md)<`VIS_TYPE`, `NEO_TYPE`\>  }

#### Type parameters

| Name |
| :------ |
| `VIS_TYPE` |
| `NEO_TYPE` |

#### Defined in

[src/types.ts:50](https://github.com/thebestnom/neovis.js/blob/441899a/src/types.ts#L50)

___

### NonFlatLabelConfig

Ƭ **NonFlatLabelConfig**: [`NonFlatNeoVisAdvanceConfig`](interfaces/NonFlatNeoVisAdvanceConfig.md)<`VisNetwork.Node`, `Neo4jTypes.Node`<`number`\>\>

#### Defined in

[src/types.ts:262](https://github.com/thebestnom/neovis.js/blob/441899a/src/types.ts#L262)

___

### NonFlatRelationsipConfig

Ƭ **NonFlatRelationsipConfig**: [`NonFlatNeoVisAdvanceConfig`](interfaces/NonFlatNeoVisAdvanceConfig.md)<`VisNetwork.Edge`, `Neo4jTypes.Relationship`<`number`\>\>

#### Defined in

[src/types.ts:263](https://github.com/thebestnom/neovis.js/blob/441899a/src/types.ts#L263)

___

### NumberOrInteger

Ƭ **NumberOrInteger**: `number` \| `Neo4jTypes.Integer`

#### Defined in

[src/types.ts:7](https://github.com/thebestnom/neovis.js/blob/441899a/src/types.ts#L7)

___

### RecursiveMapTo

Ƭ **RecursiveMapTo**<`T`, `New`\>: { [P in keyof T]: RecursiveMapToDist<T[P], New\> }

Maps a type recursively and replace each non object type with the new type

**`param`** type to map

**`param`** type to map to for each non object type

#### Type parameters

| Name |
| :------ |
| `T` |
| `New` |

#### Defined in

[src/types.ts:16](https://github.com/thebestnom/neovis.js/blob/441899a/src/types.ts#L16)

___

### RecursiveMapToDist

Ƭ **RecursiveMapToDist**<`T`, `New`\>: `T` extends `object` ? [`RecursiveMapTo`](README.md#recursivemapto)<`T`, `New`\> : `New`

#### Type parameters

| Name |
| :------ |
| `T` |
| `New` |

#### Defined in

[src/types.ts:9](https://github.com/thebestnom/neovis.js/blob/441899a/src/types.ts#L9)

___

### RecursiveMapToFunction

Ƭ **RecursiveMapToFunction**<`T`, `PARAM_TYPE`\>: { [P in keyof T]: RecursiveMapToFunctionDist<T[P], PARAM\_TYPE\> }

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

[src/types.ts:25](https://github.com/thebestnom/neovis.js/blob/441899a/src/types.ts#L25)

___

### RecursiveMapToFunctionDist

Ƭ **RecursiveMapToFunctionDist**<`T`, `PARAM_TYPE`\>: `T` extends `object` ? (`param`: `PARAM_TYPE`) => `T` \| [`RecursiveMapToFunction`](README.md#recursivemaptofunction)<`T`, `PARAM_TYPE`\> : (`param`: `PARAM_TYPE`) => `T`

#### Type parameters

| Name |
| :------ |
| `T` |
| `PARAM_TYPE` |

#### Defined in

[src/types.ts:18](https://github.com/thebestnom/neovis.js/blob/441899a/src/types.ts#L18)

## Variables

### NEOVIS\_ADVANCED\_CONFIG

• **NEOVIS\_ADVANCED\_CONFIG**: typeof [`NEOVIS_ADVANCED_CONFIG`](README.md#neovis_advanced_config)

#### Defined in

[src/types.ts:6](https://github.com/thebestnom/neovis.js/blob/441899a/src/types.ts#L6)

___

### NEOVIS\_DEFAULT\_CONFIG

• **NEOVIS\_DEFAULT\_CONFIG**: typeof [`NEOVIS_DEFAULT_CONFIG`](README.md#neovis_default_config)

#### Defined in

[src/types.ts:5](https://github.com/thebestnom/neovis.js/blob/441899a/src/types.ts#L5)

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

[src/neovis.ts:650](https://github.com/thebestnom/neovis.js/blob/441899a/src/neovis.ts#L650)

___

### objectToTitleHtml

▸ **objectToTitleHtml**(`neo4jObject`, `titleProperties`): `HTMLDivElement`

create html display of the node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `neo4jObject` | `Node`<[`NumberOrInteger`](README.md#numberorinteger)\> \| `Relationship`<[`NumberOrInteger`](README.md#numberorinteger)\> | node to create html from |
| `titleProperties` | `string`[] | which properties to map |

#### Returns

`HTMLDivElement`

#### Defined in

[src/neovis.ts:563](https://github.com/thebestnom/neovis.js/blob/441899a/src/neovis.ts#L563)

___

### objectToTitleString

▸ **objectToTitleString**(`neo4jObject`, `titleProperties`): `string`

create string display of the node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `neo4jObject` | `Node`<[`NumberOrInteger`](README.md#numberorinteger)\> \| `Relationship`<[`NumberOrInteger`](README.md#numberorinteger)\> | node to create title string from |
| `titleProperties` | `string`[] | which properties to map |

#### Returns

`string`

#### Defined in

[src/neovis.ts:584](https://github.com/thebestnom/neovis.js/blob/441899a/src/neovis.ts#L584)
