import AbstractCommand from "../AbstractCommand";
import TemporarySymbol from "../TemporarySymbol";
import CommandType from "../CommandType";


/**
 * GOTO
 */
export default class GotoCommand extends AbstractCommand {
    private placeholder: string
    static MARKER = "GT"

    getCodeLines(index: number, symbols: {
        [p: number]: TemporarySymbol
    }, reversedSymbolMap: Map<number, string>): string {
        this.placeholder = GotoCommand.MARKER + index + GotoCommand.MARKER
        return `${CommandType.BRANCH}${this.placeholder}`;
    }

    getPlaceholder() {
        return this.placeholder
    }

    getTargetLine(reversedSymbolMap: Map<number, string>): number {
        return parseInt(reversedSymbolMap.get(this.tokens[1].symbolAddress))
    }
}
