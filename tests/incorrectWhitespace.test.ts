import { assert as should } from "chai";
import * as fs from "fs";
import * as path from "path";

import { compile } from "../compiler";

describe(path.basename(__filename), function() {

	it("Compiling a file with incorrect indentation should result in an error.", function() {
		const input = fs.readFileSync(path.join(__dirname, "..", "input", "meaningfulWhitespace.pt"), { "encoding": "utf8" }).replace(/^\s+/gm, "");

		should.throw(function() {
			compile(input);
		}, Error);
	});

});
