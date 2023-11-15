import AbstractSimpleCommand from "../AbstractSimpleCommand";
import TemporarySymbol from "../TemporarySymbol";

/**
 * print
 */
export default class WriteCommand extends AbstractSimpleCommand{
    getCodeLines(index: number, symbols: {[key: number]: TemporarySymbol}): string{
        return "";
    }

}
