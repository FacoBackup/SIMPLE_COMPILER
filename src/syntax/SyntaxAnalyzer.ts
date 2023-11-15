import SyntaxSymbol from "./SyntaxSymbol";
import Token from "../lexical/Token";
import SyntaxInput from "./SyntaxInput";
import TokenType from "../lexical/TokenType";
import SyntaxError from "./SyntaxError";
import AbstractAnalyzer from "../AbstractAnalyzer";


export default class SyntaxAnalyzer extends AbstractAnalyzer {
    static ASSIGNABLE = [TokenType.VARIABLE, TokenType.INTEGER]
    static EXCLUSIVE_LINE_REQUIRED = [SyntaxSymbol.END, SyntaxSymbol.IF, SyntaxSymbol.LET]
    static REQUIRES_INTEGER_OR_VARIABLE = [SyntaxSymbol.ADD, SyntaxSymbol.SUBTRACT, SyntaxSymbol.MULTIPLY, SyntaxSymbol.DIVIDE, SyntaxSymbol.MODULO, SyntaxSymbol.EQ, SyntaxSymbol.NE, SyntaxSymbol.GT, SyntaxSymbol.LT, SyntaxSymbol.GE, SyntaxSymbol.LE]
    static FUNCTIONS = [SyntaxSymbol.GOTO, SyntaxSymbol.PRINT, SyntaxSymbol.LET, SyntaxSymbol.END_OF_LINE]
    static SIGNS = [TokenType.ADD, TokenType.SUBTRACT];

    constructor(tokens: Token[]) {
        super()
        this.tokens = [...tokens];
    }

    analyze(): ICompilerError[] {
        this.extractLineTokens()
        this.missingLineTokens.forEach(line => {
            this.throwError(SyntaxError.MISSING_LINE_ENUMERATION, line, 0)
        })
        while (this.tokens.length > 0) {
            const current = this.shift()
            const next = new SyntaxInput(this.tokens[0])
            const currentInput = new SyntaxInput(current)
            const symbol = currentInput.getSymbol();

            if (current.type == TokenType.END_OF_INPUT && this.hasReachedEnd) {
                return this.exceptions
            }
            this.checkForInconclusiveOperator(next)
            this.throwIfSymbolIsInvalid(symbol)
            this.throwIfStackIsNotEmpty(symbol)
            this.throwIfStackIsEmpty(symbol)
            this.throwIfMissingExpression(symbol)
            switch (symbol) {
                case SyntaxSymbol.END_OF_LINE ://NOVA LINHA
                    this.handleEndOfLine()
                    break
                // Atribuição
                case SyntaxSymbol.ASSIGNMENT :// atribuição '='
                    this.handleAssignment(next)
                    break
                //OPERAÇÕES
                case SyntaxSymbol.ADD :// Adição '+'
                case SyntaxSymbol.SUBTRACT : //Subtração '-'
                    this.handleSigns(next)
                    break
                case SyntaxSymbol.MULTIPLY :// Multiplicação '*'
                case SyntaxSymbol.DIVIDE :// Divisão '/'
                case SyntaxSymbol.MODULO :// Resto de Divisão '%'
                //COMPARAÇÕES
                case SyntaxSymbol.EQ :// Comparação '=='
                case SyntaxSymbol.NE :// Comparação '!='
                case SyntaxSymbol.GT :// Comparação '>'
                case SyntaxSymbol.LT :// Comparação '<'
                case SyntaxSymbol.GE :// Comparação '>='
                case SyntaxSymbol.LE :// Comparação '<='
                    this.handleOperation(next)
                    break
                case SyntaxSymbol.PRINT:
                    this.handlePrint(next)
                    break
                case SyntaxSymbol.INPUT:
                    this.handlePrint(next)
                    break
                case SyntaxSymbol.IF:
                    this.stack.push(current)
                    this.isOnIf = true
                    break
                //PALAVRAS RESERVADAS
                case SyntaxSymbol.VARIABLE :// Identificador de variavel
                case SyntaxSymbol.LET :
                case SyntaxSymbol.INTEGER :
                    this.stack.push(current)
                    break
                case SyntaxSymbol.GOTO: // HAS TO RECIEVE NUMBER
                    this.handleGOTO(next)
                    break
                case SyntaxSymbol.REM: // IGNORA LINHA
                    this.handleComment()
                    break
                case SyntaxSymbol.END:
                    this.handleEnd()
                    break
            }
        }
        if (!this.hasReachedEnd) {
            this.throwError(SyntaxError.EXPECTED_END)
        }
        return this.exceptions
    }

    /**
     *                     |
     *                     V
     * EXAMPLE: let a = 10 + REM COMMENT HERE
     * @param symbol
     */
    private throwIfStackIsNotEmpty(symbol: SyntaxSymbol) {
        if (SyntaxAnalyzer.EXCLUSIVE_LINE_REQUIRED.includes(symbol) && this.stack.length > 0) {
            this.throwError(SyntaxError.UNEXPECTED_COMMAND_BEFORE_COMMAND)
        }
    }

    private checkForInconclusiveOperator(next: SyntaxInput) {
        switch (next.getSymbol()) {
            case SyntaxSymbol.ADD :
            case SyntaxSymbol.SUBTRACT :
            case SyntaxSymbol.MULTIPLY :
            case SyntaxSymbol.DIVIDE :
            case SyntaxSymbol.MODULO :
            case SyntaxSymbol.EQ :
            case SyntaxSymbol.NE :
            case SyntaxSymbol.GT :
            case SyntaxSymbol.LT :
            case SyntaxSymbol.GE :
            case SyntaxSymbol.LE :
                this.stack.push(this.currentToken, next.token)
                break
        }
    }

    createError(message: string, line: number, column: number): ICompilerError {
        return new SyntaxError(message, line, column);
    }

    private handleEnd() {
        if (this.tokens[0] == null && this.tokens[0].type !== TokenType.END_OF_INPUT || this.stack.length > 0) {
            this.throwError(SyntaxError.UNEXPECTED_EOL)
        }

        this.hasReachedEnd = true
    }

    private handleComment() {
        this.skipLine()
    }

    private handleGOTO(next: SyntaxInput) {
        if (next.getSymbol() !== SyntaxSymbol.INTEGER) {
            this.throwError(SyntaxError.EXPECTED_INTEGER)
        }
    }

    private handleEndOfLine() {
        if (this.stack.length > 0 && !SyntaxAnalyzer.ASSIGNABLE.includes(this.stack[this.stack.length - 1].type)) {
            this.throwError(SyntaxError.EXPECTED_ASSIGNABLE)
        }

        if (this.isOnIf && this.stack.length === 0) {
            this.throwError(SyntaxError.EXPECTED_EXPRESSION)
        }

        this.isOnIf = false
        // END OF LINE, HAS TO CLEAN STACK
        this.stack.length = 0
    }

    private handleAssignment(next: SyntaxInput) {
        let includesVariable = false
        let includesLet = false
        this.stack.forEach(t => {
            if (t.type === TokenType.VARIABLE)
                includesVariable = true
            if (t.type === TokenType.LET)
                includesLet = true
        })
        if (!includesLet || !includesVariable || !SyntaxAnalyzer.ASSIGNABLE.includes(next.token.type) && !SyntaxAnalyzer.SIGNS.includes(next.token.type)) {
            this.throwError(SyntaxError.EXPECTED_VARIABLE_DECLARATION)
        }

        // VALID EXPRESSION UNTIL NOW
        this.stack.length = 0
        this.stack.push(this.currentToken)
    }

    private throwIfStackIsEmpty(symbol: SyntaxSymbol) {
        if (SyntaxAnalyzer.REQUIRES_INTEGER_OR_VARIABLE.includes(symbol) && this.stack.length === 0) {
            this.throwError(SyntaxError.EXPECTED_ASSIGNABLE)
        }
    }

    /**
     * TokenType error
     * @param symbol
     * @private
     */
    private throwIfSymbolIsInvalid(symbol: SyntaxSymbol) {
        if (symbol == null) {
            this.throwError(SyntaxError.UNEXPECTED_ERROR)
        }
    }

    private handleOperation(next: SyntaxInput) {
        if (!SyntaxAnalyzer.ASSIGNABLE.includes(next.token.type) || !SyntaxAnalyzer.ASSIGNABLE.includes(this.stack[this.stack.length - 1].type)) {
            this.throwError(SyntaxError.EXPECTED_ASSIGNABLE)
        }
    }

    private handlePrint(next: SyntaxInput) {
        if (next.getSymbol() !== SyntaxSymbol.VARIABLE) {
            this.throwError(SyntaxError.EXPECTED_ASSIGNABLE)
        }
    }

    private handleSigns(next: SyntaxInput) {
        if (!SyntaxAnalyzer.ASSIGNABLE.includes(next.token.type)) {
            this.throwError(SyntaxError.EXPECTED_ASSIGNABLE)
        }
        const isStackEmpty = this.stack.length === 0
        const previousTokenIsNotVariable = !SyntaxAnalyzer.ASSIGNABLE.includes(this.stack[this.stack.length - 1].type)
        const previousTokenIsNotAssigment = this.stack[this.stack.length - 1].type !== TokenType.ASSIGNMENT

        if (isStackEmpty || previousTokenIsNotAssigment && previousTokenIsNotVariable) {
            this.throwError(SyntaxError.UNEXPECTED_ERROR)
        }
    }

    private throwIfMissingExpression(symbol: SyntaxSymbol) {
        const lastNodeIsIf = this.stack.length === 0 || this.stack.length > 0 && this.stack[this.stack.length - 1].type === TokenType.IF
        const isFunctionNode = SyntaxAnalyzer.FUNCTIONS.includes(symbol)
        if (this.isOnIf && lastNodeIsIf && isFunctionNode) {
            this.throwError(SyntaxError.EXPECTED_EXPRESSION)
        }
    }
}
