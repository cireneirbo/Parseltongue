/* eslint-disable max-depth */

import { SyntaxKind } from "../lib/typescript/SyntaxKind";

import { compile } from "../compiler";

function getIndentationWidth(text) {
	return (/^ {2,}/m.exec(text) || [""])[0].length;
}

function getKeyOfObjectByPath(object, path) {
	return path.reduce(function(object, key) {
		return object[key];
	}, object) || object;
}

export default function visitNode(node) {
	switch (node.getKind()) {
		case SyntaxKind.DoStatement:
			throw new Error("Not yet implemented.");

			break;
		case SyntaxKind.ForInStatement:
		case SyntaxKind.ForOfStatement:
		case SyntaxKind.ForStatement:
		case SyntaxKind.FunctionDeclaration:
		case SyntaxKind.IfStatement:
		case SyntaxKind.WhileStatement:
			let currentNode = node;

			const block = (function parseBlock(nodeText) {
				currentNode = currentNode.getNextSibling();

				// FRAGILE
				if (nodeText.endsWith(" and") || nodeText.endsWith(" or") || /^\s*if not /.test(nodeText)) {
					for (; currentNode !== undefined && !currentNode.getPreviousSibling().getFullText().includes(":"); currentNode = currentNode.getNextSibling()) {
						nodeText += " " + currentNode.getFullText().trim();
					}

					nodeText = nodeText.replace(/\b and \b/g, " && ").replace(/\b or \b/g, " || ");
				}

				let identifier;
				let condition;
				let rest;

				if (/^\s*function/.test(nodeText)) {
					[identifier, condition, rest] = /(function.*?)\((.*?)\):(.*)/s.exec(nodeText).slice(1);

					rest += currentNode.getFullText().trim();

					currentNode = currentNode.getNextSibling();
				} else {
					[identifier, condition, rest] = /^\s*(for|if|while) (.*?):(.*)/s.exec(nodeText).slice(1);
				}

				const blockIndentationWidth = getIndentationWidth(rest);

				const statements = [];

				// FRAGILE
				const path = [];

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

						if (lines[x].startsWith("else")) {
							currentNode = nextSibling;

							if (nextSibling.getNextSibling().getKind() === SyntaxKind.ColonToken) {
								nextSibling = nextSibling.getNextSibling();
							}

							getKeyOfObjectByPath(statements, path).push([]);

							path.push(getKeyOfObjectByPath(statements, path).length - 1);
						} else if (lines[x].startsWith(" if")) {
							currentNode = nextSibling;

							getKeyOfObjectByPath(statements, path).push(lines[x].trim());
						} else if (currentIndentationWidth >= blockIndentationWidth) {
							currentNode = nextSibling;

							getKeyOfObjectByPath(statements, path).push(lines[x]);
						} else {
							nextSibling = undefined;

							break;
						}
					}
				}

				const blocks = (function recurse(statements) {
					const blocks = [];

					for (const statement of statements) {
						if (Array.isArray(statement)) {
							blocks.push("}\nelse {", compile(recurse(statement) + "\n}"));
						} else {
							blocks.push(statement);
						}
					}

					return blocks.join("\n");
				})(statements);

				return [identifier + " (" + condition.replace(/\bnot \b/g, "!") + ") {", blocks, "}"].join("\n");
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

	if (node.getNextSibling()) {
		visitNode(node.getNextSibling());
	}
}
