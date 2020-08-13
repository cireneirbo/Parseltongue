import { SourceFile, SyntaxKind } from "ts-morph";

export default function(sourceFile: SourceFile) {
	sourceFile.forEachDescendant(function recurse(node) {
		switch (node.getKind()) {
			case SyntaxKind.CaseBlock:
				console.log();
			case SyntaxKind.Block:
				console.log("---");
				console.log(node.getFullText());
			default:
		}
	});
}
