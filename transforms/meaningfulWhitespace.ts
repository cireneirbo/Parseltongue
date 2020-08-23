
export default function(sourceFile) {
	const oldText = sourceFile.getFullText();
	const oldLines = oldText.split("\n");
	let newLines = [];
	let singleLine = "";
	for (let i = 0; i < oldLines.length; i++) {
		singleLine = oldLines[i].replace("while ", "while (");
		singleLine = singleLine.replace(/:/g, ") {");
		singleLine = singleLine.replace(/elif /g, "} else if (");
		singleLine = singleLine.replace(/ and /g, " && ");
		singleLine = singleLine.replace(/if /g, "if (");
		singleLine = singleLine.replace(/ or /g, " || ");
		singleLine = singleLine.replace(/for /g, "for (");
		singleLine = singleLine.replace(/else /g, "} else {");
		singleLine = singleLine.replace(/ True /g, " true ");
		singleLine = singleLine.replace(/ False /g, " false ");



		if (singleLine === "") {
			try {
				if (newLines[i - 1].split("    ")[0] === "") {
					singleLine = "}"
				}
			} catch (e) {
				console.log(e)
			}

		}

		newLines[i] = singleLine;

	}

	let newLinesStr = newLines.join("\n");


	// newText = newText.replace()
	// if (newText.slice(-1) === "\n") {
	// 	newText += "}";
	// } else if (newText.slice(-1) === "") {
	// 	newText += "\n}";
	// } else {
	// 	newText += "\n}";
	// }

	sourceFile.replaceWithText(newLinesStr);
}
