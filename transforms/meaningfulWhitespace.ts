import { SyntaxKind } from "../lib/typescript/SyntaxKind";

export default function(sourceFile) {
	const oldText = sourceFile.getFullText();
	let newText = sourceFile.getFullText().replace("while ", "while (");
	newText = newText.replace(/:/g, ") {");
	newText = newText.replace(/elif /g, "} else if (");
	newText = newText.replace(/ and /g, " && ");
	newText = newText.replace(/if /g, "if (");
	newText = newText.replace(/ or /g, " || ");
	newText = newText.replace(/for /g, "for (");
	newText = newText.replace(/else /g, "} else {");
	newText = newText.replace(/ True /g, " true ");
	if (newText.slice(-1) === "\n") {
		newText += "}";
	} else {
		newText += "\n}";
	}

	sourceFile.replaceWithText(newText);
}
