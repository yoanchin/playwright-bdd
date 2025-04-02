"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringTestStep = void 0;
class StringTestStep {
    constructor(name, actualArgs, fileName, lineNumber, resultParameterName) {
        this.name = name;
        this.actualArgs = actualArgs;
        this.fileName = fileName;
        this.lineNumber = lineNumber;
        this.resultParameterName = resultParameterName;
    }
    getName() {
        return this.name;
    }
    getActualArgs() {
        return this.actualArgs;
    }
    getFileName() {
        return this.fileName;
    }
    getLineNumber() {
        return this.lineNumber;
    }
    getResultParameterName() {
        return this.resultParameterName;
    }
}
exports.StringTestStep = StringTestStep;
//# sourceMappingURL=stringTestStep.js.map