import * as fs from "fs";
import * as path from "path";

import { Project } from "ts-morph";

// Example usage:
//  npx ts-node ./compiler.ts input/twoPlusTwo.ps

export function compile(input) {
	const project = new Project();

	const sourceFile = project.createSourceFile("input.ts", input);

	const transforms = fs.readdirSync(path.join(__dirname, "transforms"));

	for (const transform of transforms) {
		const transformFunction = require(path.join(__dirname, "transforms", transform))["default"];

		if (transformFunction.name !== "skip") {
			transformFunction(sourceFile);
		}
	}

	return project.emitToMemory().getFiles()[0].text;
}

if (require.main === module) {
	console.log(compile(fs.readFileSync(process.argv.pop(), { "encoding": "utf8" })));
}
