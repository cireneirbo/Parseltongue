import { SyntaxKind } from "../lib/typescript/SyntaxKind";

function getIndentationWidth(text) {
	return (/^ {2,}/m.exec(text) || [""])[0].length;
}

export default function(sourceFile) {
	console
	// console.log(sourceFile);
	sourceFile.forEachDescendant(function(node) {
		const targetedKinds = [SyntaxKind.ColonToken];
		console.log(node.getText());
		console.log(node.getKind());

		if (targetedKinds.includes(node.getKind())) {
			switch (node.getKind()) {
				case SyntaxKind.ColonToken:
					node.replaceWithText(" {");
					let nextSibling = node.getNextSibling();
					while (true) {
						if (!nextSibling.getFullText().startsWith("   ")) {
							nextSibling = nextSibling.replaceWithText(nextSibling.getFullText() + " \n}");
							break;
						} else {
							nextSibling = nextSibling.getNextSibling();
						}
					}
				case SyntaxKind.ForInStatement:
				case SyntaxKind.ForOfStatement:
				case SyntaxKind.ForStatement:
				case SyntaxKind.IfStatement:
				// if (node.getText().endsWith(" and") || node.getText().endsWith(" or")) {
				// 	const newNodeText = node.getFullText().trim() + node.getNextSibling().getFullText();
				// 	const temp = newNodeText.replace(/ and /g, " && ").replace(/ or /g, " || ");
				// 	node.getNextSibling().replaceWithText(temp);
				// 	console.log("whatever");

				// }

				// break;
				case SyntaxKind.WhileStatement:
				// const statements = [];

				// if (node.getText().endsWith(" and") || node.getText().endsWith(" or")) {
				// 	const newNodeText = node.getFullText().trim(); //+ node.getNextSibling().getFullText();

				// 	const temp = newNodeText.replace(/ and /g, " && ").replace(/ or /g, " || ");

				// 	// node.getNextSibling().remove();

				// 	node.replaceWithText(temp);


				// 	console.log("whatever");
				// }

				// const [identifier, condition, firstStatement] = /([a-z]+) (.*):(.*)/s.exec(node.getText()).slice(1);

				// statements.push(" ".repeat(4) + firstStatement.trim());

				// const indentationWidth = getIndentationWidth(firstStatement);

				// const nodesToRemove = [];

				// for (let nextSibling = node.getNextSibling(); nextSibling !== undefined; nextSibling = nextSibling?.getNextSibling()) {
				// 	for (const line of nextSibling.getFullText().split(/\r?\n/g)) {
				// 		if (line === "") {
				// 			continue;
				// 		}

				// 		if (getIndentationWidth(line) === indentationWidth) {
				// 			statements.push(" ".repeat(4) + nextSibling.getText().trim());

				// 			nodesToRemove.push(nextSibling);
				// 		} else {
				// 			nextSibling = undefined;

				// 			break;
				// 		}
				// 	}
				// }

				// for (const node of nodesToRemove) {
				// 	node.remove();
				// }

				// node.replaceWithText(identifier + " (" + condition + ") {\n" + statements.join("\n") + "\n}\n");
				// break;
				case SyntaxKind.SwitchStatement:
				// const [caseBlock] = node.getChildrenOfKind(SyntaxKind.CaseBlock);
				default:
			}
		}




	});
}
