//import commonJs from "@rollup/plugin-commonjs";
import nodeBuiltins from "rollup-plugin-node-builtins";
//import nodeGlobals from "rollup-plugin-node-globals";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default {
	"input": "docs/js/parseltongue.ts",
	"output": {
		"file": "docs/js/parseltongue.js",
		"format": "esm"
	},
	"external": [],
	"plugins": [
		nodeResolve(),
		//commonJs(),
		nodeBuiltins(),
		//nodeGlobals(),
		typescript()
	],
	"watch": {
		"clearScreen": false
	}
};
