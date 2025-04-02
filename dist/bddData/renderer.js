"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BddDataRenderer = void 0;
/**
 * Renders BDD data in test file.
 */
const formatter_1 = require("../generate/formatter");
class BddDataRenderer {
    constructor(tests, sourceMapper) {
        this.tests = tests;
        this.sourceMapper = sourceMapper;
    }
    renderFixture() {
        return [`$bddFileData: ({}, use) => use(${BddDataRenderer.varName}),`];
    }
    renderVariable() {
        const lines = this.tests.map((test) => {
            const data = this.getBddTestData(test);
            return `${JSON.stringify(data)},`;
        });
        return [
            `const ${BddDataRenderer.varName} = [ // bdd-data-start`, // prettier-ignore
            ...lines.map(formatter_1.indent),
            ']; // bdd-data-end',
        ];
    }
    getBddTestData(test) {
        const steps = [...test.stepsData.values()].map(({ pickleStep, gherkinStep, isBg, pomFixtureName, matchedDefinition }) => {
            return {
                pwStepLine: this.sourceMapper.getPwStepLine(pickleStep),
                gherkinStepLine: gherkinStep.location.line,
                keywordOrig: gherkinStep.keyword,
                keywordType: pickleStep.type,
                isBg: isBg || undefined,
                pomFixtureName,
                stepMatchArguments: matchedDefinition?.getStepMatchArguments(),
            };
        });
        return {
            pwTestLine: this.sourceMapper.getPwTestLine(test.pickle),
            pickleLine: test.pickle.location.line,
            skipped: test.skipped || undefined,
            timeout: test.ownTimeout,
            slow: test.slow || undefined,
            tags: test.tags,
            steps,
        };
    }
}
exports.BddDataRenderer = BddDataRenderer;
BddDataRenderer.varName = 'bddFileData';
//# sourceMappingURL=renderer.js.map