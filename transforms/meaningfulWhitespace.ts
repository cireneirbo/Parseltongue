import { SyntaxKind } from "../lib/typescript/SyntaxKind";

export default function(sourceFile) {
	const oldText = sourceFile.getFullText();
	console.log(oldText);
	let newText = sourceFile.getFullText().replace("while ", "while (").replace(":", ") {").replace("elif ", "} else if (");
	newText = newText.replace(" and ", " && ").replace("if ", "if (").replace(" or ", " || ").replace("for ", "for (");
	newText = newText.replace("else ", "} else {");
	if (newText.slice(-1) === "\n") {
		newText += "}";
	} else {
		newText += "\n}";
	}

	sourceFile.replaceWithText(newText);
}
