import SemanticError from "./SemanticError";
import Token from "../lexical/Token";
import AbstractAnalyzer from "../AbstractAnalyzer";
import SyntaxInput from "../syntax/SyntaxInput";
import TokenType from "../lexical/TokenType";
import SyntaxSymbol from "../syntax/SyntaxSymbol";

export default class SemanticAnalyzer extends AbstractAnalyzer {
    private reversedSymbolMap = new Map<number, string>()
    private symbolMap: Map<string, number>;
    private declared: Map<number, number> = new Map();

    constructor(tokens: Token[], symbolMap: Map<string, number>) {
        super()
        this.tokens = tokens
        this.symbolMap = symbolMap
        Array.from(symbolMap.entries()).forEach(entry => {
            this.reversedSymbolMap.set(entry[1], entry[0])
        })
    }

    analyze(): ICompilerError[] {
        this.extractLineTokens()
        while (this.tokens.length > 0) {
            const current = this.shift()
            const next = new SyntaxInput(this.tokens[0])
            const currentInput = new SyntaxInput(current)
            const symbol = currentInput.getSymbol();

            if (current.type == TokenType.END_OF_INPUT && this.hasReachedEnd) {
                return this.exceptions
            }

            switch (symbol) {
                case SyntaxSymbol.GOTO:
                    this.handleGOTO(next);
                    break
                case SyntaxSymbol.VARIABLE:
                    this.handleVariable(next);
                    break
                case SyntaxSymbol.LET:
                    this.stack.push(current)
                    break
                case SyntaxSymbol.END_OF_LINE:
                    this.stack.length = 0
                    break
            }
        }
        return this.exceptions;
    }

    private handleVariable(next: SyntaxInput) {
        if (this.stack[0]?.type === TokenType.LET) {
            this.declared.set(this.currentToken.symbolAddress, this.currentToken.line)
            this.stack.length = 0
            return
        }
        const noVariableDeclarationFound = this.declared.get(this.currentToken.symbolAddress) == null
        const isDeclarationOnSameLine = this.declared.get(this.currentToken.symbolAddress) === this.currentToken.line
        if (noVariableDeclarationFound || isDeclarationOnSameLine) {
            this.throwError(SemanticError.VARIABLE_DECLARATION_NOT_FOUND)
        }
    }

    private handleGOTO(next: SyntaxInput) {
        const nextTokenAddress = next.token.symbolAddress
        const targetLine = this.reversedSymbolMap.get(nextTokenAddress)

        const lineFound = this.lineTokens.find(token => {
            const tokenAddress = token.symbolAddress
            return this.reversedSymbolMap.get(tokenAddress) === targetLine
        })

        if (lineFound == null) {
            this.throwError(SemanticError.GOTO_LINE_NOT_FOUND)
        }
    }

    createError(message: string, line: number, column: number): ICompilerError {
        return new SemanticError(message, line, column);
    }
}