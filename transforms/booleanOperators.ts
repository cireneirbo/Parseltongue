import { SourceFile, SyntaxKind } from "ts-morph";

export default function skip(sourceFile: SourceFile) {
	sourceFile.forEachDescendant(function(node) {
		switch (node.getKind()) {
			case SyntaxKind.IfStatement:

				console.log(node.getChildren());

				break;
			default:
		}
	});
}
