import { SyntaxKind } from "../lib/typescript/SyntaxKind";

export default function(sourceFile) {
	sourceFile.forEachDescendant(function(node) {
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

				const block = (function recurse() {
					const statements = [];

					let nodeText = currentNode.getText();

					if (nodeText.endsWith(" and") || nodeText.endsWith(" or")) {
						for (currentNode = currentNode.getNextSibling(); currentNode.getPreviousSibling().getKind() !== SyntaxKind.ColonToken; currentNode = currentNode.getNextSibling()) {
							nodeText += currentNode.getFullText();
						}

						nodeText = nodeText.replace(/ and /g, " && ").replace(/ or /g, " || ") + currentNode.getNextSibling().getFullText();
					}

					const [identifier, condition, rest] = /([a-z]+) (.*?):(.*)/s.exec(nodeText).slice(1);

					// This indentation (detection?) logic doesn't make sense

					statements.push(rest);

					const indentationWidth = getIndentationWidth(rest);

					for (let nextSibling = currentNode.getNextSibling(), nodeText = rest.slice(1); nextSibling !== undefined; nextSibling = nextSibling?.getNextSibling(), nodeText = nextSibling?.getFullText()) {
						currentNode = nextSibling;

						for (const line of nodeText.split(/\r?\n/g)) {
							if (line === "") {
								continue;
							}

							if (getIndentationWidth(line) === indentationWidth) {
								statements.push(" ".repeat(4) + nextSibling.getText().trim());
							} else {
								nextSibling = undefined;

								break;
							}
						}
					}

					return identifier + " (" + condition + ") {\n" + (statements as string[]).join("\n") + "\n}\n";
				})();

				// SourceFile replacement logic

				const [parentNode] = node.getParent().getChildren();
				const startIndex = parentNode.getChildren().indexOf(node);
				const endIndex = parentNode.getChildren().indexOf(currentNode) + 1;

				const newNodeText = [];

				for (const node of parentNode.getChildren().slice(0, startIndex)) {
					newNodeText.push(node.getText());
				}

				newNodeText.push(block);

				for (const node of parentNode.getChildren().slice(endIndex)) {
					newNodeText.push(node.getText());
				}

				parentNode.replaceWithText(newNodeText.join("\n"));

				break;
			case SyntaxKind.SwitchStatement:
				const [caseBlock] = node.getChildrenOfKind(SyntaxKind.CaseBlock);

				throw new Error("Not yet implemented.");

				break;
			default:
		}
	});
}
