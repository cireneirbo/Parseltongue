import { SyntaxKind } from "../lib/typescript/SyntaxKind";

import { compile } from "../compiler";

function getIndentationWidth(text) {
	return (/^ {2,}/m.exec(text) || [""])[0].length;
}

export default function recurse(node) {
	switch (node.getKind()) {
		case SyntaxKind.DoStatement:
			throw new Error("Not yet implemented.");

			break;
		case SyntaxKind.ForInStatement:
		case SyntaxKind.ForOfStatement:
		case SyntaxKind.ForStatement:
		case SyntaxKind.IfStatement:
		case SyntaxKind.WhileStatement:
			let currentNode = node;

			const block = (function(nodeText) {
				currentNode = currentNode.getNextSibling();

				if (nodeText.endsWith(" and") || nodeText.endsWith(" or")) {
					for (; !currentNode.getPreviousSibling().getFullText().includes(":"); currentNode = currentNode.getNextSibling()) {
						nodeText += " " + currentNode.getFullText().trim();
					}

					nodeText = nodeText.replace(/ and /g, " && ").replace(/ or /g, " || ");
				}

				const [identifier, condition, rest] = /([a-z]+) (.*?):(.*)/s.exec(nodeText).slice(1);

				const statements = [rest];

				const blockIndentationWidth = getIndentationWidth(rest);

				for (let nextSibling = currentNode; nextSibling !== undefined; nextSibling = nextSibling?.getNextSibling()) {
					for (const line of nextSibling.getFullText().split(/\r?\n/g)) {
						if (line === "") {
							continue;
						}

						const currentIndentationWidth = getIndentationWidth(line);

						if (currentIndentationWidth === blockIndentationWidth) {
							currentNode = nextSibling;

							statements.push(line);
						} else {
							nextSibling = undefined;

							break;
						}
					}
				}

				return identifier + " (" + condition + ") {\n" + compile(statements.join("\n")) + "}\n";
			})(currentNode.getFullText());

			// SourceFile replacement logic

			const [parentNode] = node.getParent().getChildren();
			const startIndex = parentNode.getChildren().indexOf(node);
			const endIndex = parentNode.getChildren().indexOf(currentNode) + 1;

			const newNodeText = [];

			for (const node of parentNode.getChildren().slice(0, startIndex)) {
				newNodeText.push(node.getFullText());
			}

			newNodeText.push(block);

			for (const node of parentNode.getChildren().slice(endIndex)) {
				newNodeText.push(node.getFullText());
			}

			parentNode.replaceWithText(newNodeText.join("\n"));

			node = parentNode.getChildren()[startIndex];

			break;
		case SyntaxKind.SwitchStatement:
			const [caseBlock] = node.getChildrenOfKind(SyntaxKind.CaseBlock);

			throw new Error("Not yet implemented.");

			break;
		default:
	}

	let hasNextSibling;

	try {
		hasNextSibling = node.getNextSibling();
	} catch (error) {
		hasNextSibling = false;
	}

	if (hasNextSibling) {
		recurse(node.getNextSibling());
	}
}
