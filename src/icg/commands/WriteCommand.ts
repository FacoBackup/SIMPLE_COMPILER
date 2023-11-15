import AbstractCommand from "../AbstractCommand";
import TemporarySymbol from "../TemporarySymbol";
import CommandType from "../CommandType";

/**
 * print
 */
export default class WriteCommand extends AbstractCommand{
    getCodeLines(index: number, symbols: { [p: number]: TemporarySymbol }, reversedSymbolMap: Map<number, string>): string{
        const [printT, valueT] = this.tokens
        return `${CommandType.WRITE}${AbstractCommand.getPlaceholder(valueT, symbols, reversedSymbolMap)}`;
    }

}
