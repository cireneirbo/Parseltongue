require.config({ "paths": { "vs": "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs" } });

let leftEditor;
let rightEditor;

// eslint-disable-next-line @typescript-eslint/no-require-imports
require(["vs/editor/editor.main"], function() {
	leftEditor = window.monaco.editor.create(document.getElementById("leftEditor"), {
		"automaticLayout": true,
		"contextmenu": false,
		"language": "python",
		"minimap": {
			"enabled": false
		}
	});

	rightEditor = window.monaco.editor.create(document.getElementById("rightEditor"), {
		"automaticLayout": true,
		"contextmenu": false,
		"language": "typescript",
		"minimap": {
			"enabled": false
		},
		"readOnly": true
	});

	fetch("https://raw.githubusercontent.com/brianjenkins94/DumbLang/master/examples/recursiveFibonacci.ts").then(function(response) {
		response.text().then(function(data) {
			leftEditor.setValue(data);
		});
	});

	fetch("https://raw.githubusercontent.com/brianjenkins94/DumbLang/master/dlc/interpreter.ts").then(function(response) {
		response.text().then(function(data) {
			rightEditor.setValue(data);
		});
	});
});

document.addEventListener("DOMContentLoaded", function(event) {

});
