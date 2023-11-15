import AbstractCommand from "../AbstractCommand";
import TemporarySymbol from "../TemporarySymbol";
import CommandType from "../CommandType";

/**
 * Input
 */
export default class ReadCommand extends AbstractCommand{
    getCodeLines(index: number, symbols: { [p: number]: TemporarySymbol }, reversedSymbolMap: Map<number, string>): string{
        const [readT, valueT] = this.tokens
        return `${CommandType.READ}${AbstractCommand.getPlaceholder(valueT, symbols, reversedSymbolMap)}`;
    }

}
