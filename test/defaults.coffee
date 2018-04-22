{defaults} = require '../src/defaults.js'
require 'fluentnode'

describe 'defaults', ->
  it 'check neo4j', ->
    using defaults.neo4j,->
      @.initialQuery  .assert_Contains 'MATCH (n) WHERE exists(n.pagerank)'
      @.neo4jUri      .assert_Is 'bolt://localhost:7687'
      @.neo4jUser     .assert_Is 'neo4j'
      @.neo4jPassword .assert_Is 'neo4j'
      @.encrypted     .assert_Is 'ENCRYPTION_OFF'
      @.trust         .assert_Is 'TRUST_ALL_CERTIFICATES'

  it 'check visjs', ->
    using defaults.visjs,->
      @.interaction.assert_Is hover    : true           , hoverConnectedEdges: true , selectConnectedEdges: false, multiselect    : 'alwaysOn'     , zoomView        : false          , experimental: { }
      @.physics    .assert_Is barnesHut: {damping: 0.1 }
      @.nodes      .assert_Is mass     : 4              , shape              : 'neo', labelHighlightBold  : false, widthConstraint: { maximum: 40 }, heightConstraint: { maximum: 40 }
      @.edges      .assert_Is
        hoverWidth    : 0,
        selectionWidth: 0,
        smooth        : type   : 'continuous'   , roundness   : 0.15
        font          : size   : 9              , strokeWidth : 0      , align: 'top'
        color         : inherit: false
        arrows        : to     : { enabled: true, type        : 'arrow', scaleFactor: 0.5 }
