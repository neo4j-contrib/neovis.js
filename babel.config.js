module.exports = {
	presets: [["@babel/preset-env", {
		targets	: "defaults",
		useBuiltIns: "usage",
		corejs: 3
	}]],
	plugins: [
		["@babel/plugin-transform-runtime", {corejs: 3}],
		"@babel/plugin-proposal-class-properties"
	]
}