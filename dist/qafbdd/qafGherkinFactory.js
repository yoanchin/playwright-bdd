"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QafGherkinFactory = void 0;
const gherkinFileParser_1 = require("./gherkinFileParser");
class QafGherkinFactory {
    static getParser() {
        return new gherkinFileParser_1.GherkinFileParser();
    }
}
exports.QafGherkinFactory = QafGherkinFactory;
//# sourceMappingURL=qafGherkinFactory.js.map