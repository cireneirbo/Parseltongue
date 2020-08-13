import * as fs from "fs";
import * as path from "path";
import Mocha, { Suite, Test } from "mocha";
import { expect } from "chai";

import { compile } from "./compiler";

const mocha = new Mocha({
	"timeout": "1m"
});

const tests = fs.readdirSync(path.join(__dirname, "input"));

for (const test of tests) {
	const suite = Suite.create(mocha.suite, path.basename(test));

	suite.addTest(new Test("The compiled code matches the expected output.", function() {
		expect(
			compile(
				fs.readFileSync(path.join(__dirname, "input", test), { "encoding": "utf8" })
			)
		).to.be.equal(
			fs.readFileSync(path.join(__dirname, "expected", test), { "encoding": "utf8" })
		);
	}));
}

mocha.run(function(failures) {
	process.exitCode = failures ? 1 : 0;
});
