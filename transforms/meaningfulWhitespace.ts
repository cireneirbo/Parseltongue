/* eslint-disable max-depth */

import { SyntaxKind } from "../lib/typescript/SyntaxKind";

//import { compile } from "../compiler";

function getIndentationWidth(text) {
	return (/^ {2,}/m.exec(text) || [""])[0].length;
}

export default function visitNode(node) {
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

			const block = (function parseBlock(nodeText) {
				currentNode = currentNode.getNextSibling();

				// FRAGILE
				if (nodeText.endsWith(" and") || nodeText.endsWith(" or")) {
					for (; currentNode !== undefined && !currentNode.getPreviousSibling().getFullText().includes(":"); currentNode = currentNode.getNextSibling()) {
						nodeText += " " + currentNode.getFullText().trim();
					}

					nodeText = nodeText.replace(/ and /g, " && ").replace(/ or /g, " || ");
				}

				const [identifier, condition, rest] = /([a-z]+) (.*?):(.*)/s.exec(nodeText).slice(1);

				const blockIndentationWidth = getIndentationWidth(rest);

				const statements = [];

				// FRAGILE
				for (let nextSibling = currentNode, lines = [...rest.split(/\r?\n/g).slice(1), ...nextSibling.getFullText().split(/\r?\n/g)]; nextSibling !== undefined; nextSibling = nextSibling?.getNextSibling(), lines = nextSibling?.getFullText().split(/\r?\n/g)) {
					for (let x = 0; x < lines.length; x++) {
						if (lines[x] === "") {
							continue;
						}

						// Debug
						//console.log(lines[x]);

						// FRAGILE
						if (lines[x].endsWith(" and") || lines[x].endsWith(" or")) {
							for (let y = x + 1, nextLines = lines; !lines[x].endsWith(":"); y++) {
								if (lines[y] === "") {
									continue;
								}

								if (y >= lines.length) {
									nextSibling = nextSibling?.getNextSibling();

									y = 0;

									nextLines = nextSibling.getFullText().split(/\r?\n/g);
								}

								lines = [lines[x], nextLines.slice(y).join("\n")].join("").split("\n");

								x = 0;
							}
						}

						const currentIndentationWidth = getIndentationWidth(lines[x]);

						if (currentIndentationWidth >= blockIndentationWidth) {
							currentNode = nextSibling;

							statements.push(lines[x]);
						} else {
							nextSibling = undefined;

							break;
						}
					}
				}

				return identifier + " (" + condition + ") {\n" + globalThis.compile(statements.join("\n")) + "}\n";
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

			// Debug
			//console.log(newNodeText);

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
		visitNode(node.getNextSibling());
	}
}
