vis   = require '../../vendor/vis/dist/vis-network.min.js'
vis   = require '../../vendor/vis/dist/vis.js'

#{JSDOM} = require 'jsdom'

describe 'visjs test', ->
  it 'should work',->
    edges = new vis.DataSet()

    #    window =  new JSDOM('<div id="viz"/>').window
    #    document = window.document
    #    container =  window.document.getElementById('viz')

    nodes = new vis.DataSet([
      {id: 1, label: 'Node 1'},
      {id: 2, label: 'Node 2'},
      {id: 3, label: 'Node 3'},
      {id: 4, label: 'Node 4'},
      {id: 5, label: 'Node 5'}
    ])


    edges = new vis.DataSet([
      {from: 1, to: 3},
      {from: 1, to: 2},
      {from: 2, to: 4},
      {from: 2, to: 5}
    ]);

    data =
      nodes: nodes,
      edges: edges

    options = {};

    #console.log document.getElementById('vi= windowz')
    #    global.window    = window
    #    global.document  = document
    #    global.navigator = window.navigator
    #    global.Element   = window.Element
    jsdom_global = require('jsdom-global')
    jsdom_global =  jsdom_global(
      "<div id='mygraph'></div>",
      { skipWindowCheck: true}
    );

    container = document.getElementById('mygraph');

    #canvas = require('canvas-prebuilt');
    #console.log new canvas().getContext()

    network = new vis.Network(container, data, options);

    canvas =  document.getElementsByTagName("canvas")[0]

    context = canvas.getContext('2d')

    console.log canvas.pngStream


