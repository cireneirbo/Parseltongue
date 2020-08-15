import { SourceFile, SyntaxKind } from "ts-morph";

function getIndentationWidth(text) {
	return (/^ {2,}/m.exec(text) || [""])[0].length; //.split(/(\S+)/, 2);
}

export default function(sourceFile: SourceFile) {
	sourceFile.forEachDescendant(function(node) {
		switch (node.getKind()) {
			case SyntaxKind.DoStatement:
			case SyntaxKind.ForInStatement:
			case SyntaxKind.ForOfStatement:
			case SyntaxKind.ForStatement:
			case SyntaxKind.IfStatement:
			case SyntaxKind.WhileStatement:
				const statements = [];

				const [identifier, condition, firstStatement] = /([a-z]+) (.*):(.*)/s.exec(node.getText()).slice(1);

				statements.push(" ".repeat(4) + firstStatement.trim());

				const indentationWidth = getIndentationWidth(firstStatement);

				const nodesToRemove = [];

				for (let nextSibling = node; nextSibling !== undefined;) {
					nextSibling = nextSibling.getNextSibling();

					for (const line of nextSibling.getFullText().split(/\r?\n/g)) {
						if (line === "") {
							continue;
						}

						if (getIndentationWidth(line) === indentationWidth) {
							statements.push(" ".repeat(4) + nextSibling.getText().trim());

							nodesToRemove.push(nextSibling);
						} else {
							nextSibling = undefined;

							break;
						}
					}
				}

				for (const node of nodesToRemove) {
					node.remove();
				}

				node.replaceWithText(identifier + " (" + condition + ") {\n" + statements.join("\n") + "\n}\n");
				break;
			case SyntaxKind.SwitchStatement:
				const [caseBlock] = node.getChildrenOfKind(SyntaxKind.CaseBlock);
			default:
		}
	});
}
