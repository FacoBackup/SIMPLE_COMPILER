import SAMPLE_CODE from "../static/SAMPLE_CODE";
import LexicalAnalyzer from "./lexical/LexicalAnalyzer";
import SyntaxAnalyzer from "./syntax/SyntaxAnalyzer";
import SyntaxError from "./syntax/SyntaxError";
import SemanticError from "./semantic/SemanticError";
import LexicalError from "./lexical/LexicalError";
import SemanticAnalyzer from "./semantic/SemanticAnalyzer";
import IntermediateCodeGenerator from "./icg/IntermediateCodeGenerator";

export default class Compiler {
    static compile(sc: string, withDescription: boolean = false): {
        lexicalErrors: ICompilerError[],
        syntaxErrors: ICompilerError[],
        semanticErrors: ICompilerError[],
        intermediateCode: string
    } {
        const code = sc.split("\n").filter(l => l.replace(/(\s+)/g, "").length !== 0).join("\n")
        const lexicalInstance = new LexicalAnalyzer(code)
        const lexicalErrors = lexicalInstance.analyze()
        let syntaxErrors: ICompilerError[] = [], semanticErrors: ICompilerError[] = [], intermediateCode: string

        if (lexicalErrors.length === 0) {
            const syntacticInstance = new SyntaxAnalyzer(lexicalInstance.tokens)
            syntaxErrors = syntacticInstance.analyze()
        }

        if (syntaxErrors.length === 0) {
            const semanticInstance = new SemanticAnalyzer(lexicalInstance.tokens, lexicalInstance.symbolTable)
            semanticErrors = semanticInstance.analyze()
        }

        if (semanticErrors.length === 0) {
            const intermediateCodeGenerator = new IntermediateCodeGenerator(lexicalInstance.tokens, lexicalInstance.symbolTable, withDescription)
            intermediateCodeGenerator.analyze()
            intermediateCode = intermediateCodeGenerator.getCode();
        }

        return {
            lexicalErrors,
            syntaxErrors,
            semanticErrors,
            intermediateCode
        }
    }
}
