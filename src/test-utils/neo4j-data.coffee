neo4j = require '../../vendor/neo4j-javascript-driver/lib/index.js'

Node         = neo4j.v1.types.Node
Relationship = neo4j.v1.types.Relationship

class Neo4j_Data

  # here is the record received from the query: 'match (n)-[r]-(p) return n,r,p limit 1'
  rawData_on_Next_Record: ->
    return  {
      keys    : [ "n", "r", "p" ],
      length  : 3,
      _fields : [
        {
          identity  : "low": 8, "high": 0
          labels    : [ "Person" ],
          properties: "name": "Emil Eifrem", "born": { "low": 1978, "high": 0 }
        },
        {
          identity  : "low": 7,"high": 0
          start     : "low": 8,"high": 0
          end       : "low": 0,"high": 0
          type      : "ACTED_IN"
          properties: "roles": [ "Emila" ]
        },
        {
          identity  : "low": 0, "high": 0
          labels    : [ "Movie" ]
          properties : "title": "The Matrix", "tagline": "Welcome to the Real World", "released": {  "low": 1999,  "high": 0 }
        }
      ],
      "_fieldLookup": "n": 0,"r": 1,"p": 2
    }

  # here is the same record as above (but created using neo4j Javascript API
  rawData_on_Next_Record_Using_Types: ()->
    node_1       = new Node(         {"low": 8, "high": 0} , [ "Person" ]        , {"name": "Emil Eifrem", "born": { "low": 1978, "high": 0 }})
    node_2       = new Node(         {"low": 0, "high": 0} , [ "Movie" ]         , {"title": "The Matrix", "tagline": "Welcome to the Real World", "released": {  "low": 1999,  "high": 0 }} )
    relationship = new Relationship( {"low": 7, "high": 0} , {"low": 8,"high": 0}, {"low": 0,"high": 0}   , "ACTED_IN" , {"roles": [ "Emila" ]})

    data =
      keys        : [ "n", "r", "p" ],
      length      : 3
      _fields     : [node_1, relationship, node_2]
      _fieldLookup: "n": 0,"r": 1,"p": 2
    return data


module.exports =  Neo4j_Data

