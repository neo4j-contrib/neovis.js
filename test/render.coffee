require 'fluentnode'
NeoVis       = (require '../src/neovis.js').default
jsdom_global = require('jsdom-global')



describe 'NeoVis | render', ->
  neoVis = null
  config =
    #server_url     : 'bolt://54.197.82.102:34060',
    server_url     : 'bolt://localhost:7687',
    server_user    : 'neo4j',
    #server_password: 'servant-jackets-fives',
    server_password: 'test'
    initial_cypher : 'match (n)-[r]-(p) return n,r,p limit 3',
    container_id   : 'viz'

  before ->
    jsdom_global =  jsdom_global("<div id='viz'></div>", { });
    neoVis       = new NeoVis(config)


  it 'check constructor options', ->
      using neoVis, ->
        @._driver._url         .assert_Is '54.197.82.102:34060'
        @._container.toString().assert_Is '[object HTMLDivElement]'

  it 'render', (done)->
    neoVis.render ()->
      labels = []
      colors = []
      for key,value of neoVis._network.body.nodes
        colors.push value.options.color.background
        labels.push value.options.label

      labels.assert_Is [ 'DataCenter', 'Rack', ''        ]
      colors.assert_Is [ '#97C2FC', '#FFFF00', '#97C2FC' ]

      neoVis._network.body.edges['178'].options.from.assert_Is 0
      neoVis._network.body.edges['178'].options.to  .assert_Is 140

      done()

  it 'createVisGraph', (done)->
    options = {}
    nodes =
      '0' : { id:  0, value: 1, label: 'Movie'   , group: 'Movie',  title: '' }
      '8' : { id:  8, value: 1, label: 'Person'  , group: 'Person', title: '' }
      '9' : { id:  9, value: 1, label: 'Test_ABC', group: 'Person', title: '' }
      '10': { id: 10, value: 1, label: 'Test_XYZ', group: 'ZYX___', title: '' }
    edges =
      '7': { id: 7, from: 8, to: 0, title: '<strong>roles:</strong> Emil<br>', value: 1, label: 'ACTED_IN' }

    neoVis.createVisGraph nodes, edges

    labels = []
    colors = []
    for key,value of neoVis._network.body.nodes
      colors.push value.options.color.background
      labels.push value.options.label
    labels.assert_Is [ 'Movie'  , 'Person' , 'Test_ABC', 'Test_XYZ', ''        ]
    colors.assert_Is [ '#97C2FC', '#FFFF00', '#FFFF00' , '#FB7E81' , '#97C2FC' ]
    done()


  it.only 'render (test path)', (done)->
    neoVis._query = 'MATCH p=()-[r:DIRECTED]->() RETURN p LIMIT 4'
    neoVis.render ()->
      # test the data fetched from Neo4j
      neoVis._nodes._keys().assert_Is  [ '5', '9', '10', '105', '121' ]
      neoVis._edges._keys().assert_Is  [ '12', '19', '142', '169' ]
      neoVis._nodes['5'].assert_Is   { id: 5, value: 1, label: 'Person', group: 'Person', title: '' }
      neoVis._edges['12'].assert_Is  { id: 12, from: 5, to: 9, title: '', value: 1, label: 'DIRECTED' }

      # test the data mapped by vis.js
      neoVis._network.body.nodes._keys().assert_Is [ '5', '9', '10', '105', '121', 'edgeId:12', 'edgeId:19', 'edgeId:142', 'edgeId:169' ]
      neoVis._network.body.edges._keys().assert_Is [ '12', '19', '142', '169' ]

      neoVis._network.body.nodes['5' ].options.color.background.assert_Is '#97C2FC'
      neoVis._network.body.edges['12'].options.label.assert_Is 'DIRECTED'
      done()

  it 'render (test query)', (done)->
    neoVis._query = 'match (n)-[r]-(p) return n,r,p limit 4'

    neoVis.render ()->
      # test the data fetched from Neo4j
      neoVis._nodes._keys().assert_Is [ '0', '5', '6', '7','8' ]
      neoVis._edges._keys().assert_Is [ '4', '5', '6', '7' ]
      neoVis._edges['4'].assert_Is { id: 4, from: 5, to: 0, title: '', value: 1, label: 'DIRECTED' }
      neoVis._edges['5'].assert_Is { id: 5, from: 6, to: 0, title: '', value: 1, label: 'DIRECTED' }

      # test the data mapped by vis.js
      neoVis._network.body.nodes._keys().assert_Is [ '0', '5', '6', '7', '8', 'edgeId:4', 'edgeId:5', 'edgeId:6', 'edgeId:7' ]
      neoVis._network.body.edges._keys().assert_Is [ '4', '5', '6', '7' ]

      neoVis._network.body.nodes['0'].options.color.background.assert_Is '#97C2FC'
      neoVis._network.body.edges['4'].options.label.assert_Is 'DIRECTED'

      done()


  it 'getOptions', ()->
    using neoVis.getOptions(), ->
      @.nodes.assert_Is
          shape           : 'dot'
          font            : { size : 26, strokeWidth: 7  }
          scaling         : { label: { enabled: true  }  }
      @.edges.assert_Is
          arrows          : { to   : { enabled: false }  }
          length          :   200
      @.layout.assert_Is
          improvedLayout  : false,
          hierarchical    : { enabled: false, sortMethod: "hubsize" }
      @.physics.assert_Is
          adaptiveTimestep: true
          stabilization: { iterations: 200, fit: true }