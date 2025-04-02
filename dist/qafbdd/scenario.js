"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scenario = void 0;
class Scenario {
    constructor(testName, steps, hasDP, metadata) {
        this.description = "";
        this.m_groups = [];
        this.m_groupsDependedUpon = [];
        this.m_methodsDependedUpon = [];
        this.m_beforeGroups = [];
        this.m_afterGroups = [];
        // protected timeOut: number;
        // private signature: string;
        this.status = "";
        this.hasDP = false;
        this.testData = [];
        this.priority = Scenario.SCANARIOBASEINDEX + Scenario.scanariocount++;
        this.scenarioName = testName.trim();
        this.steps = steps;
        if (metadata) {
            this.metadata = metadata;
        }
        this.hasDP = hasDP;
        this.init();
    }
    setTestData(testData) {
        this.testData = testData;
    }
    getTestData() {
        return this.testData;
    }
    getHasDP() {
        return this.hasDP;
    }
    getScenarioDescription() {
        return this.description;
    }
    getScenarioName() {
        return this.scenarioName;
    }
    getSteps() {
        return this.steps;
    }
    getPriority() {
        return this.priority;
    }
    getGroups() {
        return this.m_groups;
    }
    getMetadata() {
        return this.metadata;
    }
    init() {
        // Initialization logic goes here
    }
}
exports.Scenario = Scenario;
Scenario.SCANARIOBASEINDEX = 1000;
Scenario.scanariocount = 0;
//# sourceMappingURL=scenario.js.map