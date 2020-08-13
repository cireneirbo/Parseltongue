import { SourceFile, SyntaxKind } from "ts-morph";

export default function(sourceFile: SourceFile) {
	sourceFile.forEachChild(function(node) {
		if (node.getKind() !== SyntaxKind.EndOfFileToken && node.getFullText().includes("\n")) {
			//console.log(node.getFullText());
		}
	});
}
