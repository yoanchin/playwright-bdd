"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QafDocument = void 0;
class QafDocument {
    setScenarios(scenarios) {
        this.scenarios = scenarios;
    }
    getScenarios() {
        return this.scenarios;
    }
    constructor(scenarios) {
        this.scenarios = [];
        this.setScenarios(scenarios);
    }
}
exports.QafDocument = QafDocument;
//# sourceMappingURL=qafDocument.js.map