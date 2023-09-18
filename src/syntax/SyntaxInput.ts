import Token from "../lexical/Token";
import TokenType from "../lexical/TokenType";
import SyntaxSymbol from "./SyntaxSymbol";

export default class SyntaxInput {
    private readonly _token: Token

    constructor(token: Token) {
        this._token = token
    }

    getSymbol(): SyntaxSymbol {
        if (!this._token)
            return null
        const tokenType = this._token.type;
        switch (tokenType) {
            case TokenType.LET:
                return SyntaxSymbol.LET
            case TokenType.VARIABLE:
                return SyntaxSymbol.VARIABLE
            case TokenType.INTEGER :
                return SyntaxSymbol.INTEGER
            case TokenType.INPUT :// Accepts only variable
                return SyntaxSymbol.INPUT
            case TokenType.PRINT :// Accepts variable or number
                return SyntaxSymbol.PRINT
            case TokenType.ERROR:
                return null
            case TokenType.END_OF_LINE:
                return SyntaxSymbol.END_OF_LINE
            case TokenType.END_OF_INPUT:
                return SyntaxSymbol.END_OF_INPUT
            case TokenType.ASSIGNMENT:
                return SyntaxSymbol.ASSIGNMENT
            case TokenType.ADD:
                return SyntaxSymbol.ADD
            case TokenType.SUBTRACT:
                return SyntaxSymbol.SUBTRACT
            case TokenType.MULTIPLY:
                return SyntaxSymbol.MULTIPLY
            case TokenType.DIVIDE:
                return SyntaxSymbol.DIVIDE
            case TokenType.MODULO:
                return SyntaxSymbol.MODULO
            case TokenType.EQ:
                return SyntaxSymbol.EQ
            case TokenType.NE:
                return SyntaxSymbol.NE
            case TokenType.GT:
                return SyntaxSymbol.GT
            case TokenType.LT:
                return SyntaxSymbol.LT
            case TokenType.GE:
                return SyntaxSymbol.GE
            case TokenType.LE:
                return SyntaxSymbol.LE
            case TokenType.REM:
                return SyntaxSymbol.REM
            case TokenType.GOTO:
                return SyntaxSymbol.GOTO
            case TokenType.IF:
                return SyntaxSymbol.IF
            case TokenType.END:
                return SyntaxSymbol.END
        }
        return null
    }

    get token() {
        return this._token
    }
}
