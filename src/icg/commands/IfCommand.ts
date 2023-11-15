import AbstractSimpleCommand from "../AbstractSimpleCommand";
import TemporarySymbol from "../TemporarySymbol";
import TokenType from "../../lexical/TokenType";
import SimpleCommandType from "../SimpleCommandType";
import GotoCommand from "./GotoCommand";
import Token from "../../lexical/Token";

/**
 * IF, its condition and the command after condition
 */
export default class IfCommand extends AbstractSimpleCommand {
    private placeholder: string;
    private targetLineToken: Token;

    getCodeLines(index: number, symbols: {
        [p: number]: TemporarySymbol
    }, reversedSymbolMap: Map<number, string>): string {
        const [ifT, aValueT, comparisonT, bValueT, gotoT, lineT] = this.tokens

        this.placeholder = GotoCommand.MARKER + index + GotoCommand.MARKER;
        this.targetLineToken = lineT;
        let code = ""
        let aVPlaceholder = symbols[aValueT.symbolAddress].getPlaceholder();
        let bVPlaceholder = symbols[bValueT.symbolAddress].getPlaceholder();

        switch (comparisonT.type) {
            case TokenType.EQ:
                code = `${SimpleCommandType.LOAD}${aVPlaceholder}\n`
                code += `${SimpleCommandType.SUBTRACT}${bVPlaceholder}\n`
                code += `${SimpleCommandType.BRANCH_ZERO}${this.placeholder}`
                break
            case TokenType.NE:
                code = `${SimpleCommandType.LOAD}${aVPlaceholder}\n`
                code += `${SimpleCommandType.SUBTRACT}${bVPlaceholder}\n`
                code += `${SimpleCommandType.BRANCH_NEG}${this.placeholder}\n`

                code += `${SimpleCommandType.LOAD}${bVPlaceholder}\n`
                code += `${SimpleCommandType.SUBTRACT}${aVPlaceholder}\n`
                code += `${SimpleCommandType.BRANCH_NEG}${this.placeholder}`

                break
            case TokenType.LT:
                code = `${SimpleCommandType.LOAD}${aVPlaceholder}\n`
                code += `${SimpleCommandType.SUBTRACT}${bVPlaceholder}\n`
                code += `${SimpleCommandType.BRANCH_NEG}${this.placeholder}`
                break
            case TokenType.GT:
                code = `${SimpleCommandType.LOAD}${bVPlaceholder}\n`
                code += `${SimpleCommandType.SUBTRACT}${aVPlaceholder}\n`
                code += `${SimpleCommandType.BRANCH_NEG}${this.placeholder}`
                break
        }

        return code;
    }

    getPlaceholder() {
        return this.placeholder
    }

    getTargetLine(reversedSymbolMap: Map<number, string>): number {
        return parseInt(reversedSymbolMap.get(this.targetLineToken.symbolAddress))
    }
}
