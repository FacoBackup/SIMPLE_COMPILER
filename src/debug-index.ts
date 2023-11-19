import Compiler from "./Compiler";
import * as fs from "fs";
import * as path from "path";
import SyntaxError from "./syntax/SyntaxError";

async function main() {
    const FILE_NAME = process.argv[2]
    const sourceCode = (await fs.promises.readFile(path.resolve(__dirname + path.sep + FILE_NAME))).toString()
    const result = Compiler.compile(sourceCode.split("\n").filter(l => l.replace(/(\s+)/g, "").length !== 0).join("\n"), true)
    await fs.promises.writeFile(path.resolve(__dirname + path.sep + `compiled.smc`), result.intermediateCode)
}

main().catch(console.error)
