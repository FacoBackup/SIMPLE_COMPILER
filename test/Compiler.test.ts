import {test} from '@jest/globals';
import SAMPLE_CODE from "../static/SAMPLE_CODE";
import Compiler from "../src/Compiler";
import SyntaxError from "../src/syntax/SyntaxError";
import SAMPLE_CODE_WITH_ERROR from "../static/SAMPLE_CODE_WITH_ERROR";
import SemanticError from "../src/semantic/SemanticError";
import * as fs from "fs";

test('Valid code', () => {
    const exceptions = Compiler.compile(SAMPLE_CODE)

    expect(exceptions.semanticErrors.length).toEqual(0)
    expect(exceptions.lexicalErrors.length).toEqual(0)
    expect(exceptions.syntaxErrors.length).toEqual(0)
});

test('Compile', async () => {
    const result = Compiler.compile(SAMPLE_CODE, true)
    await fs.promises.writeFile("generated.smc", result.intermediateCode)
    expect(result.intermediateCode).toEqual("")
});


test('MISSING_LINE_ENUMERATION', () => {
    const exceptions = Compiler.compile(SAMPLE_CODE_WITH_ERROR.MISSING_LINE_ENUMERATION)

    expect(exceptions.semanticErrors.length).toEqual(0)
    expect(exceptions.lexicalErrors.length).toEqual(0)
    expect(exceptions.syntaxErrors[0].message).toEqual(SyntaxError.MISSING_LINE_ENUMERATION)
    expect(exceptions.syntaxErrors.filter(e => e.message === SyntaxError.MISSING_LINE_ENUMERATION).map(e => e.line)).toEqual([3, 7, 10])
});

test('MISSING_LET', () => {
    const exceptions = Compiler.compile(SAMPLE_CODE_WITH_ERROR.MISSING_LET)

    expect(exceptions.semanticErrors.length).toEqual(0)
    expect(exceptions.lexicalErrors.length).toEqual(0)
    expect(exceptions.syntaxErrors[0].message).toEqual(SyntaxError.EXPECTED_VARIABLE_DECLARATION)
    expect(exceptions.syntaxErrors[0].line).toEqual(8)
});

test('MISSING_TARGET_LINE_GOTO', () => {
    const exceptions = Compiler.compile(SAMPLE_CODE_WITH_ERROR.MISSING_TARGET_LINE_GOTO)

    expect(exceptions.semanticErrors.length).toEqual(0)
    expect(exceptions.lexicalErrors.length).toEqual(0)
    expect(exceptions.syntaxErrors[0].message).toEqual(SyntaxError.EXPECTED_INTEGER)
    expect(exceptions.syntaxErrors[0].line).toEqual(2)
});

test('MISSING_PRINT_VALUE', () => {
    const exceptions = Compiler.compile(SAMPLE_CODE_WITH_ERROR.MISSING_PRINT_VALUE)

    expect(exceptions.semanticErrors.length).toEqual(0)
    expect(exceptions.lexicalErrors.length).toEqual(0)
    expect(exceptions.syntaxErrors[0].message).toEqual(SyntaxError.EXPECTED_ASSIGNABLE)
    expect(exceptions.syntaxErrors[0].line).toEqual(9)
});

test('MISSING_IF_CONDITION', () => {
    const exceptions = Compiler.compile(SAMPLE_CODE_WITH_ERROR.MISSING_IF_CONDITION)

    expect(exceptions.semanticErrors.length).toEqual(0)
    expect(exceptions.lexicalErrors.length).toEqual(0)
    expect(exceptions.syntaxErrors[0].message).toEqual(SyntaxError.EXPECTED_EXPRESSION)
    expect(exceptions.syntaxErrors[0].line).toEqual(2)
});


test('WRONG_GOTO_LINE', () => {
    const exceptions = Compiler.compile(SAMPLE_CODE_WITH_ERROR.WRONG_GOTO_LINE)

    expect(exceptions.semanticErrors.length).toEqual(1)
    expect(exceptions.syntaxErrors.length).toEqual(0)
    expect(exceptions.lexicalErrors.length).toEqual(0)
    expect(exceptions.semanticErrors[0].message).toEqual(SemanticError.GOTO_LINE_NOT_FOUND)
    expect(exceptions.semanticErrors[0].line).toEqual(4)
});

test('VARIABLE_DECLARATION_NOT_FOUND', () => {
    const exceptions = Compiler.compile(SAMPLE_CODE_WITH_ERROR.VARIABLE_DECLARATION_NOT_FOUND)

    expect(exceptions.lexicalErrors.length).toEqual(0)
    expect(exceptions.syntaxErrors.length).toEqual(0)
    expect(exceptions.semanticErrors.length).toEqual(1)
    expect(exceptions.semanticErrors[0].message).toEqual(SemanticError.VARIABLE_DECLARATION_NOT_FOUND)
    expect(exceptions.semanticErrors[0].line).toEqual(1)
});

test('VARIABLE_DECLARATION_NOT_FOUND2', () => {
    const exceptions = Compiler.compile(SAMPLE_CODE_WITH_ERROR.VARIABLE_DECLARATION_NOT_FOUND2)

    expect(exceptions.lexicalErrors.length).toEqual(0)
    expect(exceptions.syntaxErrors.length).toEqual(0)
    expect(exceptions.semanticErrors.length).toEqual(1)
    expect(exceptions.semanticErrors[0].message).toEqual(SemanticError.VARIABLE_DECLARATION_NOT_FOUND)
    expect(exceptions.semanticErrors[0].line).toEqual(2)
});

test('VARIABLE_DECLARATION_NOT_FOUND3', () => {
    const exceptions = Compiler.compile(SAMPLE_CODE_WITH_ERROR.VARIABLE_DECLARATION_NOT_FOUND3)

    expect(exceptions.lexicalErrors.length).toEqual(0)
    expect(exceptions.syntaxErrors.length).toEqual(0)
    expect(exceptions.semanticErrors.length).toEqual(4)
    expect(exceptions.semanticErrors[0].message).toEqual(SemanticError.VARIABLE_DECLARATION_NOT_FOUND)
    expect(exceptions.semanticErrors.map(e => e.line)).toEqual([1, 3, 4, 5])
});
