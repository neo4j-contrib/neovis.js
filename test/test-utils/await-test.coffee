describe 'await-test', ->
  sleep =  (ms) ->
    new Promise (resolve) ->
      setTimeout resolve, ms

  it.only 'should work', ()->
    #console.log  'before await.'
    await sleep 50
    #console.log 'after await'