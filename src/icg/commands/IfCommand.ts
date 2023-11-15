import AbstractSimpleCommand from "../AbstractSimpleCommand";
import TemporarySymbol from "../TemporarySymbol";

/**
 * IF, its condition and the command after condition
 */
export default class IfCommand extends AbstractSimpleCommand{
    getCodeLines(index: number, symbols: {[key: number]: TemporarySymbol}): string{
        return "";
    }

}
