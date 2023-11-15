import SimpleCommandType from "./SimpleCommandType";
import Token from "../lexical/Token";
import TemporarySymbol from "./TemporarySymbol";

export default abstract class AbstractSimpleCommand {
    private _commandType: SimpleCommandType
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

    getOriginalLine(): number {
        return this._line.line
    }

    get commandType(): SimpleCommandType {
        return this._commandType;
    }

    set commandType(value: SimpleCommandType) {
        this._commandType = value;
    }

    abstract getCodeLines(index: number, symbols: { [key: number]: TemporarySymbol }): string;

    getTokens(): Token[] {
        return this.tokens;
    }
}
