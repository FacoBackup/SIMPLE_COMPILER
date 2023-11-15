import AbstractSimpleCommand from "../AbstractSimpleCommand";
import TemporarySymbol from "../TemporarySymbol";


/**
 * GOTO
 */
export default class GotoCommand extends AbstractSimpleCommand {
    private placeholder: string
    static MARKER = "GT"
    getCodeLines(index: number, symbols: { [key: number]: TemporarySymbol }): string {
        this.placeholder = GotoCommand.MARKER + index + GotoCommand.MARKER
        return "";
    }

    getPlaceholder() {
        return this.placeholder
    }

    getTargetLine(reversedSymbolMap: Map<number, string>): number {
        return parseInt(reversedSymbolMap.get(this.tokens[1].symbolAddress))
    }
}
