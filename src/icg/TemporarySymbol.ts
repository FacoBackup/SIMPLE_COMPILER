import Token from "../lexical/Token";
import TokenType from "../lexical/TokenType";

export default class TemporarySymbol {
    private token: Token
    private index: number;
    private currentLine: number;

    constructor(token: Token, index: number) {
        this.token = token
        this.index = index
    }

    getPlaceholder() {
        return "%" + this.index + "%"
    }

    getReplacement() {
        if (this.currentLine < 10)
            return "0" + this.currentLine
        return this.currentLine.toString()
    }

    getDeclaration(reversedSymbolMap: Map<number, string>, currentLine: number): string {
        this.currentLine = currentLine;
        if (this.token.type === TokenType.INTEGER) {
            let symbolValue = reversedSymbolMap.get(this.token.symbolAddress);
            let value = parseInt(symbolValue);
            if (value < 0) {
                return "-000" + symbolValue
            }
            return "+000" + symbolValue
        } else {
            return "+0000"
        }
    }
}
