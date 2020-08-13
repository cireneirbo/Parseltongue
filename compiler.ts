import * as fs from "fs";

import { Project } from "ts-morph";

// Example usage:
//  npx ts-node ./compiler.ts input/twoPlusTwo.ps

export function compile(input) {
	const project = new Project();

	project.createSourceFile("input.ts", input);

	return project.emitToMemory({
		"customTransformers": {
			"before": []
		}
	}).getFiles()[0].text;
}

if (require.main === module) {
	console.log(compile(fs.readFileSync(process.argv.pop(), { "encoding": "utf8" })));
}
