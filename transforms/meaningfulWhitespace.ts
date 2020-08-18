import { SyntaxKind } from "../lib/typescript/SyntaxKind";

function getIndentationWidth(text) {
	return (/^ {2,}/m.exec(text) || [""])[0].length;
}

export default function(sourceFile) {
	sourceFile.forEachDescendant(function(node) {
		switch (node.getKind()) {
			case SyntaxKind.DoStatement:
			case SyntaxKind.ForInStatement:
			case SyntaxKind.ForOfStatement:
			case SyntaxKind.ForStatement:
			case SyntaxKind.IfStatement:
			case SyntaxKind.WhileStatement:
				const statements = [];

				let currentNode = node;

				let nodeText = currentNode.getText();

				if (nodeText.endsWith(" and") || nodeText.endsWith(" or")) {
					for (currentNode = currentNode.getNextSibling(); currentNode.getPreviousSibling().getKind() !== SyntaxKind.ColonToken; currentNode = currentNode.getNextSibling()) {
						nodeText += currentNode.getFullText();
					}

					nodeText = nodeText.replace(/ and /g, " && ").replace(/ or /g, " || ") + currentNode.getNextSibling().getFullText();
				}

				const [identifier, condition, firstStatement] = /([a-z]+) (.*):(.*)/s.exec(nodeText).slice(1);

				statements.push(" ".repeat(4) + firstStatement.trim());

				const indentationWidth = getIndentationWidth(firstStatement);

				for (let nextSibling = currentNode.getNextSibling(); nextSibling !== undefined; nextSibling = nextSibling?.getNextSibling()) {
					currentNode = nextSibling;

					for (const line of nextSibling.getFullText().split(/\r?\n/g)) {
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

				let [parentNode] = node.getParent().getChildren();
				const startIndex = parentNode.getChildren().indexOf(node);
				const endIndex = parentNode.getChildren().indexOf(currentNode) + 1;

				const newNodeText = [];

				for (const node of parentNode.getChildren().slice(0, startIndex)) {
					newNodeText.push(node.getText());
				}

				newNodeText.push(identifier + " (" + condition + ") {\n" + statements.join("\n") + "\n}\n");

				for (const node of parentNode.getChildren().slice(endIndex)) {
					newNodeText.push(node.getText());
				}

				parentNode.replaceWithText(newNodeText.join("\n"));

				break;
			case SyntaxKind.SwitchStatement:
				const [caseBlock] = node.getChildrenOfKind(SyntaxKind.CaseBlock);
			default:
		}
	});
}
