class Neo4j_Data

  constructor : ->

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
          end       : {"low": 0,"high": 0 },
          type      : "ACTED_IN","properties": { "roles": [ "Emil" ] }
        },
        {
          identity  : "low": 0, "high": 0
          labels    : [ "Movie" ]
          properties : "title": "The Matrix", "tagline": "Welcome to the Real World", "released": {  "low": 1999,  "high": 0 }
        }
      ],
      "_fieldLookup": "n": 0,"r": 1,"p": 2
    }



module.exports =  Neo4j_Data