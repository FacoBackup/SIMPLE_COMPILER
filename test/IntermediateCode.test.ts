import {test} from '@jest/globals';
import SAMPLE_CODE from "../static/SAMPLE_CODE";
import LexicalAnalyzer from "../src/lexical/LexicalAnalyzer";
import EXPECTED_LEXICAL_OUTPUT from "../static/EXPECTED_LEXICAL_OUTPUT";

let lexicalInstance: LexicalAnalyzer
beforeEach(() => {
    lexicalInstance = new LexicalAnalyzer(SAMPLE_CODE)
    lexicalInstance.analyze()
})

test('Is compilation valid', () => {
    expect(lexicalInstance.error).toBe(false);
});
