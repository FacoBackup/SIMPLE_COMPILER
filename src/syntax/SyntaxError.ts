export default class SyntaxError extends Error implements ICompilerError {
    line: number
    column: number
    message: string
    static UNEXPECTED_EOL = "Unexpected end of line"
    static EXPECTED_END = "Expected 'end' keyword but found EOF"
    static EXPECTED_INTEGER = "Expected integer but found otherwise"
    static EXPECTED_ASSIGNABLE = "Expected assignable but found otherwise"
    static UNEXPECTED_ERROR = "Unexpected error"
    static EXPECTED_EXPRESSION = "Expected expression but found otherwise";
    static EXPECTED_VARIABLE_DECLARATION = "Expected variable declaration but found otherwise";
    static MISSING_LINE_ENUMERATION = "Missing line enumeration";
    static UNEXPECTED_COMMAND_BEFORE_COMMAND  = "Unexpected command before command";

    constructor(message: string, line: number, column: number) {
        super(` Syntactic analysis error: \n- LINE: ${line}\n- COLUMN: ${column}\n- MESSAGE: ${message}`);
        this.line = line
        this.column = column
        this.message = message
    }

}
