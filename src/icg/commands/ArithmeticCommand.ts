import AbstractCommand from "../AbstractCommand";
import TemporarySymbol from "../TemporarySymbol";
import TokenType from "../../lexical/TokenType";
import Token from "../../lexical/Token";
import CommandType from "../CommandType";


/**
 * Handles arithmetic expressions and assignment to variable
 */
export default class ArithmeticCommand extends AbstractCommand {
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
                let code = `${CommandType.LOAD}${AbstractCommand.getPlaceholder(aVariableT, symbols, reversedSymbolMap)}\n`;
                code += `${CommandType.STORE}${AbstractCommand.getPlaceholder(targetVariableT, symbols, reversedSymbolMap)}`
                return code;
            }
            case 3: { // EX: let a = -1
                const [targetVariableT, _, aVariableT] = tokensToProcess
                let code = `${CommandType.LOAD}${AbstractCommand.getPlaceholder(aVariableT, symbols, reversedSymbolMap)}\n`;
                code += `${CommandType.STORE}${AbstractCommand.getPlaceholder(targetVariableT, symbols, reversedSymbolMap)}`
                return code;
            }
            case 4: { // EX: let a = b + 1
                const [targetVariableT, aVariableT, operationT, bVariableT] = tokensToProcess
                const bVariablePlaceholder = AbstractCommand.getPlaceholder(bVariableT, symbols, reversedSymbolMap);
                let code = `${CommandType.LOAD}${AbstractCommand.getPlaceholder(aVariableT, symbols, reversedSymbolMap)}\n`;
                switch (operationT.type) {
                    case TokenType.DIVIDE:
                        code += `${CommandType.DIVIDE}${bVariablePlaceholder}`
                        break
                    case TokenType.ADD:
                        code += `${CommandType.ADD}${bVariablePlaceholder}`
                        break
                    case TokenType.SUBTRACT:
                        code += `${CommandType.SUBTRACT}${bVariablePlaceholder}`
                        break
                    case TokenType.MULTIPLY:
                        code += `${CommandType.MULTIPLY}${bVariablePlaceholder}`
                        break
                    case TokenType.MODULO:
                        code += `${CommandType.MODULE}${bVariablePlaceholder}`
                        break
                }
                code += `\n${CommandType.STORE}${AbstractCommand.getPlaceholder(targetVariableT, symbols, reversedSymbolMap)}`
                return code;
            }

        }
    }

}
