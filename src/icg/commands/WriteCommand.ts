import AbstractSimpleCommand from "../AbstractSimpleCommand";
import TemporarySymbol from "../TemporarySymbol";
import SimpleCommandType from "../SimpleCommandType";

/**
 * print
 */
export default class WriteCommand extends AbstractSimpleCommand{
    getCodeLines(index: number, symbols: { [p: number]: TemporarySymbol }, reversedSymbolMap: Map<number, string>): string{
        const [printT, valueT] = this.tokens
        return `${SimpleCommandType.WRITE}${symbols[valueT.symbolAddress].getPlaceholder()}`;
    }

}
