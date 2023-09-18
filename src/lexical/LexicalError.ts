export default class LexicalError extends Error implements ICompilerError {
    column: number;
    line: number;
    message: string

    constructor(message: string, line: number, column: number) {
        super(`LINE: ${line};\nCOLUMN: ${column}`);
        this.line = line
        this.column = column
        this.message = message
    }
}