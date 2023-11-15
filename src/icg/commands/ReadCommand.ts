import AbstractSimpleCommand from "../AbstractSimpleCommand";
import TemporarySymbol from "../TemporarySymbol";
import SimpleCommandType from "../SimpleCommandType";

/**
 * Input
 */
export default class ReadCommand extends AbstractSimpleCommand{
    getCodeLines(index: number, symbols: { [p: number]: TemporarySymbol }, reversedSymbolMap: Map<number, string>): string{
        const [readT, valueT] = this.tokens
        return `${SimpleCommandType.READ}${symbols[valueT.symbolAddress].getPlaceholder()}`;
    }

}
