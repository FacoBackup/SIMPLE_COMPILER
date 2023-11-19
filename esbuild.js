const esbuild = require("esbuild")
const COMMON = {
    tsconfig: "tsconfig.json",
    bundle: true,
    target: ["es2022"],
    minify: true,
    sourcemap: false,
    ignoreAnnotations: true,
    platform: "node",
    format: "iife",
}
const ctxA = esbuild.context(
    {
        ...COMMON,
        entryPoints: ["./src/index.ts"],
        outfile: "./build/compiler.js",
    })
const ctxB = esbuild.context({
    ...COMMON,
    entryPoints: ["./src/debug-index.ts"],
    outfile: "./build/debug-compiler.js",
})

ctxA.catch(console.error)
ctxA.then(e => {
    e.watch().catch()
    e.dispose().catch()
})

ctxB.catch(console.error)
ctxB.then(e => {
    e.watch().catch()
    e.dispose().catch()
})

