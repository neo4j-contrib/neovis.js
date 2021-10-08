[neovis.js](../README.md) / BaseNeovisConfig

# Interface: BaseNeovisConfig

## Hierarchy

- **`BaseNeovisConfig`**

  ↳ [`NeovisConfig`](NeovisConfig.md)

  ↳ [`NonFlatNeovisConfig`](NonFlatNeovisConfig.md)

## Table of contents

### Properties

- [console\_debug](BaseNeovisConfig.md#console_debug)
- [container\_id](BaseNeovisConfig.md#container_id)
- [initial\_cypher](BaseNeovisConfig.md#initial_cypher)
- [neo4j](BaseNeovisConfig.md#neo4j)
- [nonFlat](BaseNeovisConfig.md#nonflat)
- [server\_database](BaseNeovisConfig.md#server_database)
- [visConfig](BaseNeovisConfig.md#visconfig)

## Properties

### console\_debug

• `Optional` **console\_debug**: `boolean`

Should output debug messages to console

**`default`** false

#### Defined in

[src/types.ts:128](https://github.com/thebestnom/neovis.js/blob/2344f9f/src/types.ts#L128)

___

### container\_id

• **container\_id**: `string`

Html id of the element you want Neovis to render on

#### Defined in

[src/types.ts:104](https://github.com/thebestnom/neovis.js/blob/2344f9f/src/types.ts#L104)

___

### initial\_cypher

• `Optional` **initial\_cypher**: `string`

The Cypher query that will get the data

#### Defined in

[src/types.ts:123](https://github.com/thebestnom/neovis.js/blob/2344f9f/src/types.ts#L123)

___

### neo4j

• `Optional` **neo4j**: `Driver` \| [`Neo4jConfig`](Neo4jConfig.md)

Neo4j Driver instance or configuration to make one

#### Defined in

[src/types.ts:113](https://github.com/thebestnom/neovis.js/blob/2344f9f/src/types.ts#L113)

___

### nonFlat

• `Optional` **nonFlat**: `boolean`

Tells Neovis is the config is flat or not

**`default`** false

#### Defined in

[src/types.ts:135](https://github.com/thebestnom/neovis.js/blob/2344f9f/src/types.ts#L135)

___

### server\_database

• `Optional` **server\_database**: `string`

database name you want to connect to

**`default`** neo4j

#### Defined in

[src/types.ts:109](https://github.com/thebestnom/neovis.js/blob/2344f9f/src/types.ts#L109)

___

### visConfig

• `Optional` **visConfig**: `Options`

Vis network config to override neovis defaults

**`link`** https://visjs.github.io/vis-network/docs/network/#options

#### Defined in

[src/types.ts:118](https://github.com/thebestnom/neovis.js/blob/2344f9f/src/types.ts#L118)
