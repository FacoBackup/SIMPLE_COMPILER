const esbuild = require("esbuild")
const ctx = esbuild.context(
    {
        tsconfig: "tsconfig.json",
        bundle: true,
        target: ["es2022"],
        minify: true,
        sourcemap: false,
        ignoreAnnotations: true,
        platform: "node",
        entryPoints: ["./src/index.ts"],
        format: "iife",
        outfile: "./build/compiler.js",
    })

ctx.catch(console.error)
ctx.then(e => {
    e.watch().catch()
    e.dispose().catch()
})

