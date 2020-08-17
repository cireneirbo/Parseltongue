import { SyntaxKind } from "../lib/typescript/SyntaxKind";

export default function(sourceFile) {
	console.log(sourceFile.getFullText());
	let keywordCount = {
		"while": 0,
		"if": 0
	};
	let oldText = sourceFile.getFullText();
	let newText = sourceFile.getFullText().replace("while", "while (").replace(":", ") {").replace("and", "&&") + "\n}";

	// // source
	// const sourceFileSplitted = sourceFile.getFullText().split(" ");
	// let sourceFileTransformed = "";
	// for (let i = 0; i < sourceFileSplitted.length; i++) {
	// 	if (sourceFileSplitted[i].includes("while")) {
	// 		sourceFileSplitted[i] = sourceFileSplitted[i].replace("while", "while (");
	// 		keywordCount["while"] += 1;
	// 	}
	// 	sourceFileTransformed += " " + sourceFileSplitted[i];
	// 	console.log(i);
	// }

	sourceFile.replaceWithText(newText);
}
