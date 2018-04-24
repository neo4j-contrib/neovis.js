module.exports = function () {
    return {
        files: [
            { pattern: 'vendor/neo4j-javascript-driver/**/*.js', instrument: false, load: true , ignore: false },
            { pattern: 'vendor/vis/dist/*.js'                  , instrument: false, load: true , ignore: false },
            'src/**/*.js',
            'src/**/*.coffee'
        ],

        tests: [
            'test/**/*.coffee'
        ],
        compilers: {
        },
        env: {

            type: 'node',
            runner: 'node',
            params: {
                runner: `-r ${require.resolve('esm')}`
            }
        }
    }
}
