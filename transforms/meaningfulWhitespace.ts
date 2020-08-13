import { SourceFile, SyntaxKind } from "ts-morph";

export default function(sourceFile: SourceFile) {
	sourceFile.forEachDescendant(function recurse(node) {
		switch (node.getKind()) {
			case SyntaxKind.LabeledStatement:
			default:
		}
	});

	sourceFile.forEachDescendant(function recurse(node) {
		switch (node.getKind()) {
			case SyntaxKind.Block:
			case SyntaxKind.CaseBlock:
				const data = node.getText().slice(1, -1);

				let indentationLevel = 0;

				const indentationWidth = (data.match(/^ {2,}/m) || [""])[0].length;

				// eslint-disable-next-line @typescript-eslint/prefer-for-of
				for (let x = 0; x < data.length; x++) {
					const [indentation, firstToken] = (data[x].match(/^\s{2,}?\S+/) || [""])[0].split(/(\S+)/, 2);
					const lastToken = data[x].split(/(\S+)$/, 2).pop();

					if (data[x] !== "" || indentationLevel === indentation.length / indentationWidth) {
						if (indentation.length === ((indentationLevel + 1) * indentationWidth)) {
							indentationLevel += 1;
						} else if (indentation.length === ((indentationLevel - 1) * indentationWidth)) {
							indentationLevel -= 1;
						} else if (indentation.length === ((indentationLevel - 2) * indentationWidth)) {
							// Big jump, but not unreasonable
							indentationLevel = indentation.length / indentationWidth;
						} else if (indentation.length !== ((indentationLevel) * indentationWidth)
							&& indentation.length % indentationWidth === 0) {
							throw new Error("IndentationError!");
						}
					}
				}
			default:
		}
	});
}
