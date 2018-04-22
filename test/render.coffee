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

  xit 'render', (done)->
    neoVis.render ->
      console.log neoVis._nodes._keys()
      console.log neoVis._edges._keys()
      done()
