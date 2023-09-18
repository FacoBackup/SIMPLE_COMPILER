import Token from "./lexical/Token";
import TokenType from "./lexical/TokenType";
import SyntaxError from "./syntax/SyntaxError";

export default abstract class AbstractAnalyzer implements IAnalyzer {
    protected tokens: Token[];
    protected currentToken: Token;
    protected lineTokens: Token[];
    protected hasReachedEnd: boolean = false;
    protected missingLineTokens: number[];
    protected exceptions: ICompilerError[] = [];
    protected originalTokens: Token[] = []
    protected isOnIf: boolean;
    protected stack: Token[] = [];
    protected skipErrors = true

    protected shift() {
        const first = this.tokens[0]
        this.tokens.splice(0, 1)
        this.currentToken = first
        return first
    }

    abstract analyze(): ICompilerError[]

    protected extractLineTokens() {
        this.originalTokens = [...this.tokens]

        const lineTokens: Token[] = []
        let isEndOfLine = false
        let missingLineTokens = []
        this.tokens.forEach((token, index) => {
            if (token.type === TokenType.END_OF_LINE) {
                isEndOfLine = true
                return
            }
            if ((isEndOfLine || index === 0) && token.type === TokenType.INTEGER) {
                lineTokens.push(token)
                isEndOfLine = false
            } else if ((isEndOfLine || index === 0) && token.type !== TokenType.INTEGER && token.type !== TokenType.REM) {
                missingLineTokens.push(token.line)
                isEndOfLine = false
            }
        })
        this.missingLineTokens = missingLineTokens
        this.tokens = this.tokens.filter(t => !lineTokens.includes(t))
        this.lineTokens = lineTokens// FOR TESTING IF GOTO LINE EXISTS
    }

    abstract createError(message: string, line: number, column: number): ICompilerError;

    protected throwError(message: string, line: number = this.currentToken.line, column: number = this.currentToken.column) {
        this.exceptions.push(this.createError(message, line, column))
        if(!this.skipErrors) {
            this.skipLine()
        }
    }

    protected skipLine(){
        let currentToken = this.currentToken
        while (currentToken != null && currentToken.type !== TokenType.END_OF_LINE) {
            currentToken = this.shift()
        }
        this.isOnIf = false
        this.stack.length = 0
    }

}