import AbstractSimpleCommand from "../AbstractSimpleCommand";
import TemporarySymbol from "../TemporarySymbol";
import SimpleCommandType from "../SimpleCommandType";


/**
 * GOTO
 */
export default class GotoCommand extends AbstractSimpleCommand {
    private placeholder: string
    static MARKER = "GT"

    getCodeLines(index: number, symbols: {
        [p: number]: TemporarySymbol
    }, reversedSymbolMap: Map<number, string>): string {
        this.placeholder = GotoCommand.MARKER + index + GotoCommand.MARKER
        return `${SimpleCommandType.BRANCH}${this.placeholder}`;
    }

    getPlaceholder() {
        return this.placeholder
    }

    getTargetLine(reversedSymbolMap: Map<number, string>): number {
        return parseInt(reversedSymbolMap.get(this.tokens[1].symbolAddress))
    }
}
