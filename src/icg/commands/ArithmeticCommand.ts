import AbstractSimpleCommand from "../AbstractSimpleCommand";
import TemporarySymbol from "../TemporarySymbol";


/**
 * Handles arithmetic expressions and assignment to variable
 */
export default class ArithmeticCommand extends AbstractSimpleCommand {
    getCodeLines(index: number, symbols: { [key: number]: TemporarySymbol }): string {
        return "";
    }

}
