require 'fluentnode'
NeoVis       = (require '../src/neovis.js').default
jsdom_global = require('jsdom-global')



describe 'NeoVis | render', ->
  neoVis = null
  config =
    server_url     : 'bolt://54.197.82.102:34060',
    server_user    : 'neo4j',
    server_password: 'servant-jackets-fives',
    initial_cypher : 'match (n)-[r]-(p) return n,r,p limit 1',
    container_id   : 'viz'

  before ->
    jsdom_global =  jsdom_global("<div id='viz'></div>", { });
    neoVis       = new NeoVis(config)


  it 'check constructor options', ->
      using neoVis, ->
        @._driver._url         .assert_Is '54.197.82.102:34060'
        @._container.toString().assert_Is '[object HTMLDivElement]'

  it.only 'render', (done)->
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