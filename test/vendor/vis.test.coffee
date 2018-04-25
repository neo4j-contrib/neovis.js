require 'fluentnode'
vis          = require '../../vendor/vis/dist/vis-network.min.js'
vis          = require '../../vendor/vis/dist/vis.js'
jsdom_global = require('jsdom-global')

describe 'visjs test', ->

  it 'should work',->
    edges = new vis.DataSet()

    nodes = new vis.DataSet([
      {id: 1, label: 'Node 1 ABC'},
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

    jsdom_global =  jsdom_global(
      "<div id='mygraph'></div>",
      { skipWindowCheck: true}
    );
    container = document.getElementById('mygraph');

    network = new vis.Network(container, data, options);
    network.body.nodes['1'].options.label.toString().assert_Is 'Node 1 ABC'
    network.body.nodes['2'].options.label.toString().assert_Is 'Node 2'

    canvas =  document.getElementsByTagName("canvas")[0]

    canvas                 .toString().assert_Is '[object HTMLCanvasElement]'
    canvas.getContext('2d').toString().assert_Is '[object CanvasRenderingContext2D]'






# note making this vis work was not easy since the canvas support on node seems to be quite flaky
#  the error "Cannot read webkitBackingStorePixelRatio of null" was show (caused by canvas context to be null)

