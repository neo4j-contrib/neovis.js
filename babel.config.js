module.exports = {
	"presets": [["@babel/preset-env", {}]],
	"plugins": [
		["@babel/plugin-transform-runtime", {"corejs": 3}],
		"@babel/plugin-proposal-class-properties"
	]
}