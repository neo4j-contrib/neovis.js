require 'fluentnode'
Neo4j_Data = require '../../src/test-utils/neo4j-data'


describe.only 'test-utils | Neo4j_Data', ->
  neo4j_Data = null

  before ()->
    neo4j_Data = new Neo4j_Data()

  it 'rawData_on_Next_Record',->

    using neo4j_Data.rawData_on_Next_Record(), ->
      @.keys             .assert_Is [ "n", "r", "p" ]
      @.length           .assert_Is 3
      @._fields.size()   .assert_Is 3
      @._fields[0].labels.assert_Is ['Person']
      @._fields[1].type  .assert_Is ['ACTED_IN']
      @._fields[2].labels.assert_Is ['Movie']
      @._keys()          .assert_Is [ 'keys', 'length', '_fields', '_fieldLookup' ]

      console.log 'done'