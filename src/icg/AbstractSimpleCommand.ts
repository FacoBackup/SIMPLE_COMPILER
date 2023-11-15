import SimpleCommandType from "./SimpleCommandType";
import Token from "../lexical/Token";
import TemporarySymbol from "./TemporarySymbol";

export default abstract class AbstractSimpleCommand {
    protected tokens: Token[] = []
    private _line: Token;

    constructor(tokens: Token[]) {
        this.tokens.push(...tokens)
        this._line = tokens[0]
        this.tokens.shift()
    }


    getLine(reversedSymbolMap: Map<number, string>): number {
        const lineNumber = reversedSymbolMap.get(this._line.symbolAddress);
        return parseInt(lineNumber);
    }


    abstract getCodeLines(index: number, symbols: {
        [p: number]: TemporarySymbol
    }, reversedSymbolMap: Map<number, string>): string;

    getTokens(): Token[] {
        return this.tokens;
    }
}
