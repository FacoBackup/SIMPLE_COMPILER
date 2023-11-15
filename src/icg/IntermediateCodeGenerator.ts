import Token from "../lexical/Token";
import AbstractAnalyzer from "../AbstractAnalyzer";
import SyntaxInput from "../syntax/SyntaxInput";
import TokenType from "../lexical/TokenType";
import SyntaxSymbol from "../syntax/SyntaxSymbol";
import ICGError from "./ICGError";
import AbstractSimpleCommand from "./AbstractSimpleCommand";
import CommandProcessor from "./CommandProcessor";
import IfCommand from "./commands/IfCommand";
import GotoCommand from "./commands/GotoCommand";
import ArithmeticCommand from "./commands/ArithmeticCommand";
import WriteCommand from "./commands/WriteCommand";
import ReadCommand from "./commands/ReadCommand";

export default class IntermediateCodeGenerator extends AbstractAnalyzer {
    private reversedSymbolMap = new Map<number, string>()
    private symbolMap: Map<string, number>;
    private lines: Token[][] = []
    private currentLine: Token[] = []
    private commands: AbstractSimpleCommand[] = []
    private code: string = null

    constructor(tokens: Token[], symbolMap: Map<string, number>) {
        super()
        this.tokens = tokens
        this.symbolMap = symbolMap
        Array.from(symbolMap.entries()).forEach(entry => {
            this.reversedSymbolMap.set(entry[1], entry[0])
        })
    }

    getCode() {
        return this.code
    }

    analyze(): ICompilerError[] {
        let isInComment = false

        while (this.tokens.length > 0) {
            const current = this.shift()
            if (current.type === TokenType.REM) {
                isInComment = true;
            }

            if (current.type === TokenType.END_OF_LINE) {
                this.lines.push([...this.currentLine])
                this.currentLine.length = 0
                isInComment = false
            } else if (!isInComment) {
                this.currentLine.push(this.currentToken)
            }
        }

        for (let i = 0; i < this.lines.length; i++) {
            const currentLine = this.lines[i]
            this.processLine(currentLine)
        }

        this.code = CommandProcessor.process(this.commands, this.reversedSymbolMap)
        return this.exceptions;
    }

    private processLine(line: Token[]) {
        for (let i = 0; i < line.length; i++) {
            const current = line[i];
            const symbol = (new SyntaxInput(current)).getSymbol();

            switch (symbol) {
                case SyntaxSymbol.GOTO:
                    this.commands.push(new GotoCommand(line))
                    break
                case SyntaxSymbol.IF:
                    this.commands.push(new IfCommand(line))
                    break
                case SyntaxSymbol.LET:
                case SyntaxSymbol.ASSIGNMENT:
                    this.commands.push(new ArithmeticCommand(line))
                    break
                case SyntaxSymbol.INPUT:
                    this.commands.push(new ReadCommand(line))
                    break
                case SyntaxSymbol.PRINT:
                    this.commands.push(new WriteCommand(line))
                    break
            }
        }
    }

    createError(message: string, line: number, column: number): ICompilerError {
        return new ICGError(message, line, column);
    }
}
