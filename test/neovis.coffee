require 'fluentnode'
NeoVis       = (require '../src/neovis.js').default
jsdom_global = require('jsdom-global')

jsdom_global =  jsdom_global("", { });

describe 'NeoVis', ->
  neoVis = null

  beforeEach ->
    neoVis        = new NeoVis()

  it 'constructor', ->
    using neoVis, ->
      @._config    .assert_Is {}
      @._nodes     .assert_Is {}
      @._edges     .assert_Is {}
      @._data      .assert_Is {}
      @._encrypted .assert_Is 'ENCRYPTION_OFF'
      @._trust     .assert_Is 'TRUST_ALL_CERTIFICATES'
      @._query     .assert_Contains 'MATCH (n) WHERE exists(n.pagerank)'
      @._driver    .constructor.name.assert_Is 'Driver'
      assert_Is_Null @._network
      assert_Is_Null @._container

  it '_addNode', ->
    node = id : 10.random_Letters(), value: 1000.random()
    neoVis._addNode node
    neoVis._nodes._keys().assert_Is [node.id]
    neoVis._nodes[node.id].assert_Is node

  it '_addEdge', ->
    edge = id : 10.random_Letters(), value: 1000.random()
    neoVis._addEdge edge
    neoVis._edges._keys().assert_Is [edge.id]
    neoVis._edges[edge.id].assert_Is edge

  it 'buildNodeVisObject', ->
    visObject =
      labels: [],
      identity : toInt: ()->
      properties :  []

    neoVis.buildNodeVisObject(visObject)
          .assert_Is { id: undefined, value: 1, label: '', group: undefined, title: '' }

  it 'buildEdgeVisObject', ->
    visObject =
      identity : toInt: ()->
      start    : toInt: ()->
      end      : toInt: ()->

    neoVis.buildEdgeVisObject(visObject)
      .assert_Is { id: undefined, from: undefined, to: undefined, title: '', value: 1, label: undefined }