import { SyntaxKind } from "../lib/typescript/SyntaxKind";

export default function(sourceFile) {
	// const oldText = sourceFile.getFullText();
	let newText = sourceFile.getFullText().replace("while ", "while (").replace(":", ") {").replace(" and ", " && ");
	newText = newText.replace("if ", "if (").replace(" or ", " || ").replace("for ", "for (");
	if (newText.slice(-1) === "\n") {
		newText += "}";
	} else {
		newText += "\n}";
	}

	sourceFile.replaceWithText(newText);
}
