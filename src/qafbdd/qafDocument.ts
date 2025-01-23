import { Scenario } from "./scenario";

export class QafDocument {
    scenarios: Scenario[] = [];
    setScenarios(scenarios: Scenario[]) {
        this.scenarios = scenarios;
    }
    getScenarios(): Scenario[] {
        return this.scenarios;
    }

    constructor(scenarios: Scenario[]) {
        this.setScenarios(scenarios);
    }
}