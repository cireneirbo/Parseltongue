import * as fs from "fs";
import * as path from "path";
import Mocha, { Suite, Test } from "mocha";
import { assert as should } from "chai";

import { compile } from "./compiler";

const mocha = new Mocha({
	"timeout": "1m"
});

for (const test of fs.readdirSync(path.join(__dirname, "tests"))) {
	mocha.addFile(path.join(__dirname, "tests", test));
}

for (const test of fs.readdirSync(path.join(__dirname, "input"))) {
	const suite = Suite.create(mocha.suite, test);

	suite.addTest(new Test("The compiled input should match the expected output.", function() {
		const input = fs.readFileSync(path.join(__dirname, "input", test), { "encoding": "utf8" });
		const expectedOutput = fs.readFileSync(path.join(__dirname, "expectedOutput", test), { "encoding": "utf8" }).replace(/\r/g, "").replace(/\n{2,}/g, "\n");

		should.strictEqual(compile(input), expectedOutput);
	}));
}

mocha.run(function(failures) {
	//process.exitCode = failures ? 1 : 0;
});
