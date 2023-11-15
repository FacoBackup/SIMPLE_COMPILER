import AbstractCommand from "../AbstractCommand";
import TemporarySymbol from "../TemporarySymbol";
import TokenType from "../../lexical/TokenType";
import CommandType from "../CommandType";
import GotoCommand from "./GotoCommand";
import Token from "../../lexical/Token";

/**
 * IF, its condition and the command after condition
 */
export default class IfCommand extends AbstractCommand {
    private placeholder: string;
    private targetLineToken: Token;

    getCodeLines(index: number, symbols: {
        [p: number]: TemporarySymbol
    }, reversedSymbolMap: Map<number, string>): string {
        const [ifT, aValueT, comparisonT, bValueT, gotoT, lineT] = this.tokens

        this.placeholder = GotoCommand.MARKER + index + GotoCommand.MARKER;
        this.targetLineToken = lineT;
        let code = ""
        const aVPlaceholder = AbstractCommand.getPlaceholder(aValueT, symbols, reversedSymbolMap);
        const bVPlaceholder = AbstractCommand.getPlaceholder(bValueT, symbols, reversedSymbolMap);

        switch (comparisonT.type) {
            case TokenType.EQ:
                code = `${CommandType.LOAD}${aVPlaceholder}\n`
                code += `${CommandType.SUBTRACT}${bVPlaceholder}\n`
                code += `${CommandType.BRANCH_ZERO}${this.placeholder}`
                break
            case TokenType.NE:
                code = `${CommandType.LOAD}${aVPlaceholder}\n`
                code += `${CommandType.SUBTRACT}${bVPlaceholder}\n`
                code += `${CommandType.BRANCH_NEG}${this.placeholder}\n`

                code += `${CommandType.LOAD}${bVPlaceholder}\n`
                code += `${CommandType.SUBTRACT}${aVPlaceholder}\n`
                code += `${CommandType.BRANCH_NEG}${this.placeholder}`

                break
            case TokenType.LT:
                code = `${CommandType.LOAD}${aVPlaceholder}\n`
                code += `${CommandType.SUBTRACT}${bVPlaceholder}\n`
                code += `${CommandType.BRANCH_NEG}${this.placeholder}`
                break
            case TokenType.GT:
                code = `${CommandType.LOAD}${bVPlaceholder}\n`
                code += `${CommandType.SUBTRACT}${aVPlaceholder}\n`
                code += `${CommandType.BRANCH_NEG}${this.placeholder}`
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
