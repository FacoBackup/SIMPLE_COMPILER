export default class SemanticError extends Error implements ICompilerError {
    line: number
    column: number
    message: string
    static GOTO_LINE_NOT_FOUND = "GOTO command line not found";
    static VARIABLE_DECLARATION_NOT_FOUND = "Variable declaration not found";
    constructor(message: string, line: number, column: number) {
        super(` Semantic analysis error: \n- LINE: ${line}\n- COLUMN: ${column}\n- MESSAGE: ${message}`);
        this.line = line
        this.column = column
        this.message = message
    }

}
