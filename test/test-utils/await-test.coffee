#NeoVis  = (require '../../src/neovis.js').default
#jsdom_global = require('jsdom-global')
#require "fluentnode"
#
#describe 'await-test', ->
#  neoVis = null
#
#  before ->
#    jsdom_global =  jsdom_global("<div id='viz'></div>", { });
#    neoVis       = new NeoVis({})
#
#  it 'test NeoVis asyncTest', ->
#    neoVis = new NeoVis({})
#    promise = neoVis.asyncTest()
#    promise.then ->
#      console.log 'after async test'
#
#  it 'test NeoVis asyncCall', ->
#    console.log 'before the call'
#    console.log await neoVis.asyncCall()
#    console.log 'after the call'
