import { SyntaxKind } from "../lib/typescript/SyntaxKind";

function getIndentationWidth(text) {
	return (/^ {2,}/m.exec(text) || [""])[0].length;
}

export default function(sourceFile) {
	sourceFile.forEachChild(function recurse(node) {
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

				const block = (function recurse(nodeText) {
					currentNode = currentNode.getNextSibling();

					if (nodeText.endsWith(" and") || nodeText.endsWith(" or")) {
						for (; !currentNode.getPreviousSibling().getFullText().includes(":"); currentNode = currentNode.getNextSibling()) {
							nodeText += " " + currentNode.getFullText().trim();
						}

						nodeText = nodeText.replace(/ and /g, " && ").replace(/ or /g, " || ");
					}

					const [identifier, condition, rest] = /([a-z]+) (.*?):(.*)/s.exec(nodeText).slice(1);

					const statements = [];

					const blockIndentationWidth = getIndentationWidth(rest);

					// [!] Problem
					for (let nextSibling = currentNode.getNextSibling(), nodeText = rest.slice(1); nextSibling !== undefined; nextSibling = nextSibling?.getNextSibling(), nodeText = nextSibling?.getFullText()) {
						for (const line of nodeText.split(/\r?\n/g)) {
							if (line === "") {
								continue;
							}

							const currentIndentationWidth = getIndentationWidth(line);

							if (currentIndentationWidth === blockIndentationWidth) {
								currentNode = nextSibling;

								statements.push(line);
							} else if (currentIndentationWidth === blockIndentationWidth + 4) {
								currentNode = nextSibling;

								statements.push(recurse(line));
							} else {
								nextSibling = undefined;

								break;
							}
						}
					}

					return identifier + " (" + condition + ") {\n" + (statements as string[]).join("\n") + "\n}\n";
				})(currentNode.getFullText());

				// SourceFile replacement logic

				const [parentNode] = node.getParent().getChildren();
				const startIndex = parentNode.getChildren().indexOf(node);
				const endIndex = parentNode.getChildren().indexOf(currentNode);

				const newNodeText = [];

				for (const node of parentNode.getChildren().slice(0, startIndex)) {
					newNodeText.push(node.getFullText());
				}

				newNodeText.push(block);

				for (const node of parentNode.getChildren().slice(endIndex)) {
					newNodeText.push(node.getFullText());
				}

				console.log(newNodeText);
				parentNode.replaceWithText(newNodeText.join("\n"));

				recurse(parentNode.getChildren()[startIndex + 1]);

				break;
			case SyntaxKind.SwitchStatement:
				const [caseBlock] = node.getChildrenOfKind(SyntaxKind.CaseBlock);

				throw new Error("Not yet implemented.");

				break;
			default:
		}
	});
}
