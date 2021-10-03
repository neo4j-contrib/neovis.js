[neovis.js](../README.md) / BaseNeovisConfig

# Interface: BaseNeovisConfig

## Hierarchy

- **BaseNeovisConfig**

  ↳ [*NeovisConfig*](neovisconfig.md)

  ↳ [*NonFlatNeovisConfig*](nonflatneovisconfig.md)

## Table of contents

### Properties

- [console\_debug](baseneovisconfig.md#console_debug)
- [container\_id](baseneovisconfig.md#container_id)
- [initial\_cypher](baseneovisconfig.md#initial_cypher)
- [neo4j](baseneovisconfig.md#neo4j)
- [nonFlat](baseneovisconfig.md#nonflat)
- [server\_database](baseneovisconfig.md#server_database)
- [visConfig](baseneovisconfig.md#visconfig)

## Properties

### console\_debug

• `Optional` **console\_debug**: *boolean*

Should output debug messages to console

**`default`** false

Defined in: [index.d.ts:127](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L127)

___

### container\_id

• **container\_id**: *string*

Html id of the element you want NeoVis to render on

Defined in: [index.d.ts:103](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L103)

___

### initial\_cypher

• `Optional` **initial\_cypher**: *string*

The Cypher query that will get the data

Defined in: [index.d.ts:122](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L122)

___

### neo4j

• `Optional` **neo4j**: [*Neo4jConfig*](neo4jconfig.md) \| Driver

Neo4j Driver instance or configuration to make one

Defined in: [index.d.ts:112](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L112)

___

### nonFlat

• `Optional` **nonFlat**: *boolean*

Tells Neovis is the config is flat or not

**`default`** false

Defined in: [index.d.ts:134](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L134)

___

### server\_database

• `Optional` **server\_database**: *string*

database name you want to connect to

**`default`** neo4j

Defined in: [index.d.ts:108](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L108)

___

### visConfig

• `Optional` **visConfig**: Options

Vis network config to override neovis defaults

**`link`** https://visjs.github.io/vis-network/docs/network/#options

Defined in: [index.d.ts:117](https://github.com/thebestnom/neovis.js/blob/ed1c244/index.d.ts#L117)
