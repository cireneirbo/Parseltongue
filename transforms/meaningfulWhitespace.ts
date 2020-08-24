
function placeConstAndLet(identifier, line) {
	const variables = line.split(identifier)[1].split("=")[0].split(",");
	const values = line.split(identifier)[1].split("=")[1].split(",");

	let newLine = "";
	for (let v = 0; v < variables.length; v++) {
		newLine += identifier + variables[v] + " = " + values[v] + "\n";
	}

	return newLine;
}

function takeCareClosingBracket(singleLine, newLines, i) {
	if (singleLine === "") {
		try {
			let spacesPreviousLineBlock = newLines[i - 1].split("    ").length;
			if (spacesPreviousLineBlock > 1) {
				for (let cb = 0; cb < (spacesPreviousLineBlock - 1); cb++) {
					singleLine += "    ".repeat(spacesPreviousLineBlock - 2 - cb) + "}\n";
				}
			}
		} catch (e) {
			console.log(e)
		}
	}

	return singleLine;
}

export default function(sourceFile) {
	const oldText = sourceFile.getFullText();
	const oldLines = oldText.split("\n");
	let newLines = [];
	let singleLine = "";
	for (let i = 0; i < oldLines.length; i++) {
		singleLine = oldLines[i].replace("while ", "while (");

		if (singleLine.includes(":") && !singleLine.includes("else:")) {
			singleLine = singleLine.replace(/:/g, ") {");
		}

		singleLine = singleLine.replace(/ and /g, " && ");
		singleLine = singleLine.replace(/ or /g, " || ");
		singleLine = singleLine.replace(/for /g, "for (");
		singleLine = singleLine.replace(/ True /g, " true ");
		singleLine = singleLine.replace(/ False /g, " false ");

		// Order matters
		singleLine = singleLine.replace(/else:/g, "} else {");
		singleLine = singleLine.replace(/elif /g, "} else if (");
		if (singleLine.includes("if") && !singleLine.includes("else if")) {
			singleLine = singleLine.replace(/if /g, "if (");
		}


		if (singleLine.includes("const ") && !singleLine.includes("(const ")) {
			singleLine = placeConstAndLet("const ", singleLine);
		} else if (singleLine.includes("let ") && !singleLine.includes("(let ")) {
			singleLine = placeConstAndLet("let ", singleLine);
		}

		singleLine = takeCareClosingBracket(singleLine, newLines, i);

		newLines[i] = singleLine;

	}

	let newLinesStr = newLines.join("\n");

	sourceFile.replaceWithText(newLinesStr);
}
