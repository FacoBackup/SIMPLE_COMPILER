import AbstractSimpleCommand from "./AbstractSimpleCommand";
import SimpleCommandType from "./SimpleCommandType";
import TokenType from "../lexical/TokenType";
import TemporarySymbol from "./TemporarySymbol";
import GotoCommand from "./commands/GotoCommand";

type MappedLines = { [key: number]: number }
type Symbols = { [key: number]: TemporarySymbol }

export default class CommandProcessor {

    static process(commands: AbstractSimpleCommand[], reversedSymbolMap: Map<number, string>): string {
        let index = 0;
        const allTokens = commands.map(c => c.getTokens()).flat()
        const symbols: Symbols = {}
        const mappedLines: MappedLines = {}

        for (let i = 0; i < allTokens.length; i++) {
            const current = allTokens[i]
            const previous = i - 1 >= 0 ? allTokens[i - 1] : undefined
            if (current.type === TokenType.VARIABLE || current.type === TokenType.INTEGER) {
                if (previous?.type !== TokenType.GOTO) {
                    symbols[current.symbolAddress] = new TemporarySymbol(current, i)
                } else {
                    const desiredLine = parseInt(reversedSymbolMap.get(current.symbolAddress));
                    mappedLines[desiredLine] = -1
                }
            }
        }

        let code = ""
        for (let i = 0; i < commands.length; i++) {
            const command = commands[i]
            let codeLines = command.getCodeLines(index, symbols);

            const line = command.getLine(reversedSymbolMap);
            const originalLine = command.getLine(reversedSymbolMap);

            mappedLines[originalLine] = line;

            index += codeLines.split("\n").length
            code += codeLines + "\n"
        }


        for (let i = 0; i < commands.length; i++) {
            const current = commands[i];
            if (current instanceof GotoCommand) {
                const targetLine = current.getTargetLine(reversedSymbolMap);
                code.replaceAll(current.getPlaceholder(), mappedLines[targetLine].toString())
            }
        }

        let symbolsToDeclare = Object.entries(symbols);
        symbolsToDeclare.forEach(symbol => {
            code += symbol[1].getDeclaration(reversedSymbolMap, index) + "\n"
            index++;
        })

        symbolsToDeclare.forEach(symbol => {
            code.replaceAll(symbol[1].getPlaceholder(), symbol[1].getReplacement())
        })

        return code + SimpleCommandType.HALT;
    }
}
