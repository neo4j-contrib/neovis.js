module.exports = function (wallaby) {
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
            '**/*.js?(x)': wallaby.compilers.babel({}),
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
