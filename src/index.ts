import Compiler from "./Compiler";
import * as fs from "fs";
import * as path from "path";
import SyntaxError from "./syntax/SyntaxError";

async function main() {
    const FILE_NAME = process.argv[2]
    const sourceCode = (await fs.promises.readFile(path.resolve(__dirname + path.sep + FILE_NAME))).toString()
    const errors = Compiler.compile(sourceCode, true)
    const splitSource = sourceCode.split("\n")

    if (errors instanceof SyntaxError) {
        console.log(`
        MESSAGE:\x1b[31m ${errors.message} \x1b[0m
        LINE:\x1b[31m ${errors.line} \x1b[0m
        COLUMN:\x1b[31m ${errors.column} \x1b[0m
        LINE WITH ERROR ----> \x1b[31m ${splitSource[errors.line-1]} \x1b[0m
        `.replace(/^(\s+)/gm, ""))
    } else
        console.log("\x1b[32mThe source-code provided is valid \x1b[0m")
}
main().catch(console.error)