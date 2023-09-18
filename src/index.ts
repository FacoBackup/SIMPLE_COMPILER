import Compiler from "./Compiler";
import * as fs from "fs";
import * as path from "path";
import SyntaxError from "./syntax/SyntaxError";

async function main() {
    const FILE_NAME = process.argv[2]
    let sourceCode = (await fs.promises.readFile(path.resolve(__dirname + path.sep + FILE_NAME))).toString()
    sourceCode = sourceCode.split("\n").filter(l => l.replace(/(\s+)/g, "").length !== 0).join("\n")
    const errors = Compiler.compile(sourceCode)
    const splitSource = sourceCode.split("\n")

    console.log("\n-----------------------------------------\n")
    console.log("Lexical errors: ")
    errors.lexicalErrors.map(error => {
        logError(error, splitSource)
    })
    console.log("\n-----------------------------------------\n")
    console.log("Syntactic errors: ")
    errors.syntaxErrors.map(error => {
        logError(error, splitSource)
    })
    console.log("\n-----------------------------------------\n")
    console.log("Semantic errors: ")
    errors.semanticErrors.map(error => {
        logError(error, splitSource)
    })
    console.log("\n-----------------------------------------\n")

    if (errors.semanticErrors.length === 0 && errors.syntaxErrors.length === 0 && errors.lexicalErrors.length === 0)
        console.log("\x1b[32mThe source-code provided is valid \x1b[0m")
}

main().catch(console.error)

function logError(error: ICompilerError, splitSource: string[]) {
    console.log(`
    MESSAGE:\x1b[31m ${error.message} \x1b[0m
    LINE:\x1b[31m ${error.line} \x1b[0m
    COLUMN:\x1b[31m ${error.column} \x1b[0m
    LINE WITH ERROR ----> \x1b[31m ${splitSource[error.line - 1]} \x1b[0m
    `)
}