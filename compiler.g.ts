interface ICompilerError{
    line: number,
    column: number,
    message: string
}

interface IAnalyzer {
    analyze(): ICompilerError[]
}