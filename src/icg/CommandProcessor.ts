import AbstractCommand from "./AbstractCommand";
import CommandType from "./CommandType";
import TokenType from "../lexical/TokenType";
import TemporarySymbol from "./TemporarySymbol";
import GotoCommand from "./commands/GotoCommand";
import Token from "../lexical/Token";
import IfCommand from "./commands/IfCommand";

type MappedLines = { [key: number]: number }
type Symbols = { [key: number]: TemporarySymbol }

export default class CommandProcessor {

    static process(commands: AbstractCommand[], reversedSymbolMap: Map<number, string>, withDescription: boolean): string {
        const allTokens = commands.map(c => c.getTokens()).flat()
        const symbols: Symbols = {}
        const mappedLines: MappedLines = {}
        this.prepare(allTokens, symbols, reversedSymbolMap, mappedLines);
        let code = this.generateCode(commands, symbols, reversedSymbolMap, mappedLines)
        code = this.replaceGotoLines(commands, reversedSymbolMap, code, mappedLines);
        code = this.replaceTemporaryMarkers(symbols, code, reversedSymbolMap)

        if (withDescription) {
            code = code.split("\n").map((p, i) => {
                if (p.trim().length === 0)
                    return ""
                const command = p.substring(1, 3);
                const variable = p.substring(3, p.length);
                const commandName = CommandType.getName(command);
                i++
                if (command !== "00") {
                    let memoryType = "VARIABLE"
                    if (CommandType.BRANCH_NEG.includes(command) || CommandType.BRANCH.includes(command) || CommandType.BRANCH_ZERO.includes(command)) {
                        memoryType = " GT LINE"
                    }
                    if (CommandType.HALT.includes(command))
                        return `${p}    #${i < 10 ? "0" + i : i} - COMMAND: ${commandName}`
                    return `${p}    #${i < 10 ? "0" + i : i} - COMMAND: ${commandName.padEnd(11, " ")} - ${memoryType}: ${variable}`
                } else {
                    return `${p}    #${i < 10 ? "0" + i : i} - VARIABLE`
                }
            }).join("\n")
        }
        return code;
    }

    private static replaceTemporaryMarkers(symbols: Symbols, code: string, reversedSymbolMap: Map<number, string>) {
        const symbolsToDeclare = Object.values(symbols);
        let index = code.split("\n").length
        symbolsToDeclare.forEach(symbol => {
            code += symbol.getDeclaration(reversedSymbolMap, index) + "\n"
            index++;
        })

        symbolsToDeclare.forEach(symbol => {
            code = code.replaceAll(symbol.getPlaceholder(), symbol.getReplacement())
        })

        return code
    }

    private static generateCode(commands: AbstractCommand[], symbols: Symbols, reversedSymbolMap: Map<number, string>, mappedLines: MappedLines): string {
        let index = 0;
        let code = ""
        for (let i = 0; i < commands.length; i++) {
            const command = commands[i]
            let codeLines = command.getCodeLines(index, symbols, reversedSymbolMap);
            const parts = codeLines.split("\n");
            const line = command.getLine(reversedSymbolMap);
            mappedLines[line] = index + 1;

            index += parts.length
            code += codeLines + "\n"
        }
        return code + CommandType.HALT + "\n";
    }

    private static prepare(allTokens: Token[], symbols: Symbols, reversedSymbolMap: Map<number, string>, mappedLines: MappedLines) {
        for (let i = 0; i < allTokens.length; i++) {
            const current = allTokens[i]
            const previous = i - 1 >= 0 ? allTokens[i - 1] : undefined
            if (current.type === TokenType.VARIABLE || current.type === TokenType.INTEGER) {
                const symbol = reversedSymbolMap.get(current.symbolAddress);
                if (previous?.type !== TokenType.GOTO) {
                    symbols[symbol] = new TemporarySymbol(current, previous, i)
                } else {
                    const desiredLine = parseInt(symbol);
                    mappedLines[desiredLine] = -1
                }
            }
        }
    }

    private static replaceGotoLines(commands: AbstractCommand[], reversedSymbolMap: Map<number, string>, code: string, mappedLines: MappedLines): string {
        for (let i = 0; i < commands.length; i++) {
            const current = commands[i];
            if (current instanceof GotoCommand || current instanceof IfCommand) {
                const targetLine = current.getTargetLine(reversedSymbolMap);
                let value = mappedLines[targetLine];
                let valueStr = value.toString()
                if (value < 10)
                    valueStr = "0" + value
                code = code.replaceAll(current.getPlaceholder(), valueStr)
            }
        }
        return code;
    }
}
