"use strict";
/**
 * Class to invoke step in playwright runner.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BddStepInvoker = void 0;
const getLocationInFile_1 = require("../playwright/getLocationInFile");
const DataTable_1 = require("../cucumber/DataTable");
const bddTestFixturesAuto_1 = require("./bddTestFixturesAuto");
const runStepWithLocation_1 = require("../playwright/runStepWithLocation");
const finder_1 = require("../steps/finder");
const helpers_1 = require("../features/helpers");
class BddStepInvoker {
    constructor(bddContext) {
        this.bddContext = bddContext;
        this.stepFinder = new finder_1.StepFinder(bddContext.config);
    }
    /**
     * Invokes particular step.
     * See: https://github.com/cucumber/cucumber-js/blob/main/src/runtime/test_case_runner.ts#L299
     */
    async invoke(stepText, // step text without keyword
    argument, stepFixtures) {
        this.bddContext.stepIndex++;
        this.bddContext.step.title = stepText;
        const matchedDefinition = this.findStepDefinition(stepText);
        const stepTextWithKeyword = this.getStepTextWithKeyword(stepText);
        // Get location of step call in generated test file.
        // This call must be exactly here to have correct call stack (before async calls)
        const location = (0, getLocationInFile_1.getLocationInFile)(this.bddContext.testInfo.file);
        const stepParameters = await this.getStepParameters(matchedDefinition, stepText, argument || undefined);
        const fixturesArg = this.getStepFixtures(stepFixtures || {});
        await (0, runStepWithLocation_1.runStepWithLocation)(this.bddContext.test, stepTextWithKeyword, location, () => {
            // Although pw-style does not expect usage of world / this in steps,
            // some projects request it for better migration process from cucumber.
            // Here, for pw-style we pass empty object as world.
            // See: https://github.com/vitalets/playwright-bdd/issues/208
            return matchedDefinition.definition.fn.call(this.bddContext.world, fixturesArg, ...stepParameters);
        });
    }
    findStepDefinition(stepText) {
        const { keywordType, gherkinStepLine } = this.getBddStepData();
        const stepDefinitions = this.stepFinder.findDefinitions(keywordType, stepText, this.bddContext.tags);
        if (stepDefinitions.length === 1)
            return stepDefinitions[0];
        const stepTextWithKeyword = this.getStepTextWithKeyword(stepText);
        const fullStepLocation = `${this.bddContext.featureUri}:${gherkinStepLine}`;
        if (stepDefinitions.length === 0) {
            // todo: better error?
            throw new Error(`Missing step: ${stepTextWithKeyword}`);
        }
        const message = (0, finder_1.formatDuplicateStepsMessage)(stepDefinitions, stepTextWithKeyword, fullStepLocation);
        throw new Error(message);
    }
    async getStepParameters(matchedDefinition, world, argument) {
        const parameters = await matchedDefinition.getMatchedParameters(world);
        if (argument?.dataTable) {
            parameters.push(new DataTable_1.DataTable(argument.dataTable));
        }
        else if (argument?.docString) {
            parameters.push(argument.docString.content);
        }
        // todo: handle invalid code length
        // see: https://github.com/cucumber/cucumber-js/blob/main/src/models/step_definition.ts#L25
        return parameters;
    }
    getStepFixtures(providedFixtures) {
        const { pomFixtureName } = this.getBddStepData();
        if (pomFixtureName) {
            // for decorator steps keep only one fixture - POM instance.
            const pomFixture = providedFixtures[pomFixtureName];
            if (!pomFixture)
                throw new Error(`POM fixture not provided: ${pomFixtureName}`);
            providedFixtures = { [pomFixtureName]: pomFixture };
        }
        return Object.assign({}, providedFixtures, (0, bddTestFixturesAuto_1.getBddAutoInjectFixtures)(this.bddContext));
    }
    getStepTextWithKeyword(stepText) {
        const { keywordOrig } = this.getBddStepData();
        return (0, helpers_1.getStepTextWithKeyword)(keywordOrig, stepText);
    }
    getBddStepData() {
        const { stepIndex, bddTestData } = this.bddContext;
        const bddStepData = bddTestData.steps[stepIndex];
        if (!bddStepData) {
            throw new Error([
                `bddStepData not found for step index: ${stepIndex}.`,
                `Steps: ${JSON.stringify(bddTestData.steps)}`,
            ].join(' '));
        }
        return bddStepData;
    }
}
exports.BddStepInvoker = BddStepInvoker;
//# sourceMappingURL=bddStepInvoker.js.map