neovis.js

# neovis.js

## Table of contents

### References

- [default](README.md#default)

### Enumerations

- [NeoVisEvents](enums/neovisevents.md)

### Classes

- [NeoVis](classes/neovis.md)

### Interfaces

- [Edge](interfaces/edge.md)
- [LabelConfig](interfaces/labelconfig.md)
- [Neo4jConfig](interfaces/neo4jconfig.md)
- [NeoVisAdvanceConfig](interfaces/neovisadvanceconfig.md)
- [NeovisConfig](interfaces/neovisconfig.md)
- [Node](interfaces/node.md)
- [RelationshipConfig](interfaces/relationshipconfig.md)

### Type aliases

- [Cypher](README.md#cypher)
- [RecursiveMapTo](README.md#recursivemapto)
- [RecursiveMapToFunction](README.md#recursivemaptofunction)

### Variables

- [NEOVIS\_ADVANCED\_CONFIG](README.md#neovis_advanced_config)
- [NEOVIS\_DEFAULT\_CONFIG](README.md#neovis_default_config)

### Functions

- [objectToTitleHtml](README.md#objecttotitlehtml)
- [objectToTitleString](README.md#objecttotitlestring)

## References

### default

Renames and exports: [NeoVis](classes/neovis.md)

## Type aliases

### Cypher

Ƭ **Cypher**: *string*

Cypher quarry

Defined in: [index.d.ts:39](https://github.com/thebestnom/neovis.js/blob/0d65c84/index.d.ts#L39)

___

### RecursiveMapTo

Ƭ **RecursiveMapTo**<T, New\>: { [P in keyof T]: T[P] extends object ? RecursiveMapTo<T[P], New\> : New}

Maps a type recursively and replace each non object type with the new type

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | type to map |
| `New` | type to map to for each non object type |

Defined in: [index.d.ts:22](https://github.com/thebestnom/neovis.js/blob/0d65c84/index.d.ts#L22)

___

### RecursiveMapToFunction

Ƭ **RecursiveMapToFunction**<T, PARAM_TYPE\>: { [P in keyof T]: T[P] extends object ? function \| RecursiveMapToFunction<T[P], PARAM\_TYPE\> : function}

Maps a type recursively and adds the ability for each object property to be a function that returns the same type
but replace each non object type with a function that returns the same type

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | type to map |
| `PARAM_TYPE` | type of parameter the functions get |

Defined in: [index.d.ts:32](https://github.com/thebestnom/neovis.js/blob/0d65c84/index.d.ts#L32)

## Variables

### NEOVIS\_ADVANCED\_CONFIG

• `Const` **NEOVIS\_ADVANCED\_CONFIG**: unique *symbol*

Defined in: [index.d.ts:5](https://github.com/thebestnom/neovis.js/blob/0d65c84/index.d.ts#L5)

___

### NEOVIS\_DEFAULT\_CONFIG

• `Const` **NEOVIS\_DEFAULT\_CONFIG**: unique *symbol*

Defined in: [index.d.ts:4](https://github.com/thebestnom/neovis.js/blob/0d65c84/index.d.ts#L4)

## Functions

### objectToTitleHtml

▸ **objectToTitleHtml**(`neo4jNode`: Neo4j.Node, `title_properties`: [*string*]): HTMLDivElement

create html display of the node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `neo4jNode` | Neo4j.Node | node to create html from |
| `title_properties` | [*string*] | which properties to map |

**Returns:** HTMLDivElement

Defined in: [index.d.ts:340](https://github.com/thebestnom/neovis.js/blob/0d65c84/index.d.ts#L340)

___

### objectToTitleString

▸ **objectToTitleString**(`neo4jNode`: Neo4j.Node, `title_properties`: [*string*]): *string*

create string display of the node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `neo4jNode` | Neo4j.Node | node to create title string from |
| `title_properties` | [*string*] | which properties to map |

**Returns:** *string*

Defined in: [index.d.ts:347](https://github.com/thebestnom/neovis.js/blob/0d65c84/index.d.ts#L347)
