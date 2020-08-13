import { SourceFile, SyntaxKind, NumericLiteral } from "ts-morph";

export default function skip(sourceFile: SourceFile) {
	sourceFile.forEachChild(function(node) {
		switch (node.getKind()) {
			case SyntaxKind.NumericLiteral:
				if ((node as NumericLiteral).getLiteralValue() === 2) {
					(node as NumericLiteral).setLiteralValue(3);
				}
				break;
			default:
		}
	});
}
