import { Project } from "../../lib/ts-morph/ts-morph";

import transform from "../../transforms/meaningfulWhitespace";

globalThis.compile = function(input) {
	// Normalize whitespace
	input = input.replace(/^\t+/gm, function(match) {
		return " ".repeat(match.length * 4);
	}).replace(/[ \t]+$/gm, "");

	const project = new Project({
		"compilerOptions": {
			"allowJs": true,
			"allowSyntheticDefaultImports": true,
			"alwaysStrict": false,
			"esModuleInterop": true,
			"experimentalDecorators": true,
			"moduleResolution": "Node",
			"target": "ES2015"
		}
	});

	const sourceFile = project.createSourceFile("input.ts", input, { "overwrite": true });

	transform(sourceFile.getChildren()[0].getChildren()[0]);

	const output = project.emitToMemory().getFiles()[0].text;

	project.removeSourceFile(sourceFile);

	return output;
};
