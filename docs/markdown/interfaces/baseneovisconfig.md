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

[src/neovis.ts:134](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L134)

___

### container\_id

• **container\_id**: `string`

Html id of the element you want Neovis to render on

#### Defined in

[src/neovis.ts:110](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L110)

___

### initial\_cypher

• `Optional` **initial\_cypher**: `string`

The Cypher query that will get the data

#### Defined in

[src/neovis.ts:129](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L129)

___

### neo4j

• `Optional` **neo4j**: [`Neo4jConfig`](Neo4jConfig.md) \| `Driver`

Neo4j Driver instance or configuration to make one

#### Defined in

[src/neovis.ts:119](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L119)

___

### nonFlat

• `Optional` **nonFlat**: `boolean`

Tells Neovis is the config is flat or not

**`default`** false

#### Defined in

[src/neovis.ts:141](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L141)

___

### server\_database

• `Optional` **server\_database**: `string`

database name you want to connect to

**`default`** neo4j

#### Defined in

[src/neovis.ts:115](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L115)

___

### visConfig

• `Optional` **visConfig**: `Options`

Vis network config to override neovis defaults

**`link`** https://visjs.github.io/vis-network/docs/network/#options

#### Defined in

[src/neovis.ts:124](https://github.com/thebestnom/neovis.js/blob/710afe0/src/neovis.ts#L124)
