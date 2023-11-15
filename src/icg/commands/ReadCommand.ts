import AbstractSimpleCommand from "../AbstractSimpleCommand";
import TemporarySymbol from "../TemporarySymbol";

/**
 * Input
 */
export default class ReadCommand extends AbstractSimpleCommand{
    getCodeLines(index: number, symbols: {[key: number]: TemporarySymbol}): string{
        return "";
    }

}
