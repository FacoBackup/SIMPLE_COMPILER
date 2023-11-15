import AbstractSimpleCommand from "../AbstractSimpleCommand";
import TemporarySymbol from "../TemporarySymbol";
import TokenType from "../../lexical/TokenType";
import Token from "../../lexical/Token";
import SimpleCommandType from "../SimpleCommandType";


/**
 * Handles arithmetic expressions and assignment to variable
 */
export default class ArithmeticCommand extends AbstractSimpleCommand {
    getCodeLines(index: number, symbols: {
        [p: number]: TemporarySymbol
    }, reversedSymbolMap: Map<number, string>): string {

        let tokensToProcess = []
        for (let i = 0; i < this.tokens.length; i++) {
            let token = this.tokens[i];
            if (token.type === TokenType.ASSIGNMENT) {
                tokensToProcess.push(this.tokens[i - 1], this.tokens[i + 1], this.tokens[i + 2], this.tokens[i + 3])
                tokensToProcess = tokensToProcess.filter(e => e !== undefined)
                break
            }
        }
        switch (tokensToProcess.length) {
            case 2: { // EX: let a = 1
                const [targetVariableT, aVariableT] = tokensToProcess
                let code = `${SimpleCommandType.LOAD}${symbols[aVariableT.symbolAddress].getPlaceholder()}\n`;
                code += `${SimpleCommandType.STORE}${symbols[targetVariableT.symbolAddress].getPlaceholder()}`
                return code;
            }
            case 3: { // EX: let a = -1
                const [targetVariableT, _, aVariableT] = tokensToProcess
                let code = `${SimpleCommandType.LOAD}${symbols[aVariableT.symbolAddress].getPlaceholder()}\n`;
                code += `${SimpleCommandType.STORE}${symbols[targetVariableT.symbolAddress].getPlaceholder()}`
                return code;
            }
            case 4: { // EX: let a = b + 1
                const [targetVariableT, aVariableT, operationT, bVariableT] = tokensToProcess
                const bVariablePlaceholder = symbols[bVariableT.symbolAddress].getPlaceholder();
                let code = `${SimpleCommandType.LOAD}${symbols[aVariableT.symbolAddress].getPlaceholder()}\n`;
                switch (operationT.type) {
                    case TokenType.DIVIDE:
                        code += `${SimpleCommandType.DIVIDE}${bVariablePlaceholder}`
                        break
                    case TokenType.ADD:
                        code += `${SimpleCommandType.ADD}${bVariablePlaceholder}`
                        break
                    case TokenType.SUBTRACT:
                        code += `${SimpleCommandType.SUBTRACT}${bVariablePlaceholder}`
                        break
                    case TokenType.MULTIPLY:
                        code += `${SimpleCommandType.MULTIPLY}${bVariablePlaceholder}`
                        break
                    case TokenType.MODULO:
                        code += `${SimpleCommandType.MODULE}${bVariablePlaceholder}`
                        break
                }
                code += `\n${SimpleCommandType.STORE}${symbols[targetVariableT.symbolAddress].getPlaceholder()}`
                return code;
            }

        }
    }

}
