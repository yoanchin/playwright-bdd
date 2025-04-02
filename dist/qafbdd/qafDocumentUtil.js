"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QafDocumentUtil = void 0;
const gherkinDocumentUtil_1 = require("./gherkinDocumentUtil");
const chance_1 = __importDefault(require("chance"));
const crypto_1 = require("crypto");
class QafDocumentUtil {
    static generateFixedNumbers(inputString, numDigits) {
        // 使用SHA256哈希函数
        const hash = (0, crypto_1.createHash)('sha256');
        hash.update(inputString);
        const hexDig = hash.digest('hex');
        // 从哈希值中提取固定数量的数字
        const numbers = [];
        for (let i = 0; i < numDigits; i++) {
            // 取哈希值的第i个字符，并转换为数字
            const number = parseInt(hexDig[i], 16);
            numbers.push(number);
        }
        return numbers;
    }
    static generateManyUniqueRandomIntegersWithChance(n) {
        const uniqueNumbers = new Set();
        let min = 1;
        let max = 1000000;
        while (uniqueNumbers.size < n) {
            const randomNumber = this.chance.integer({ min, max });
            uniqueNumbers.add(randomNumber);
        }
        return Array.from(uniqueNumbers);
    }
    static generateManyUniqueRandomIntegersArrayWithChance(n, m) {
        let result = [];
        for (let i = 0; i < n; i++) {
            const uniqueNumbers = new Set();
            let min = 1;
            let max = 1000000;
            while (uniqueNumbers.size < m) {
                const randomNumber = this.chance.integer({ min, max });
                uniqueNumbers.add(randomNumber);
            }
            result[i] = Array.from(uniqueNumbers);
        }
        return result;
    }
    static generateOneUniqueRandomIntegersWithChance() {
        let min = 1;
        let max = 1000000;
        const randomNumber = this.chance.integer({ min, max });
        return randomNumber;
    }
    static setTableBody(scenario) {
        if (!scenario.getHasDP()) { //if no data provider, then no need to set table header
            return scenario;
        }
        let datafile = scenario.getMetadata()['datafile'];
        let object = scenario.getTestData()[0][0];
        let keys = Object.keys(object);
        let values = [];
        for (let i = 0; i < scenario.getTestData().length; i++) {
            values[i] = [];
            for (let j = 0; j < keys.length; j++) {
                values[i].push(scenario.getTestData()[i][0][keys[j]]);
            }
        }
        let body = gherkinDocumentUtil_1.GherkinDocumentUtil.genTableBody(values, this.generateManyUniqueRandomIntegersArrayWithChance(values.length, keys.length), this.generateFixedNumbers(datafile, values.length));
        scenario.tableBody = body;
        return scenario;
    }
    static setTableBodys(scenarios) {
        scenarios.forEach(scenario => {
            this.setTableBody(scenario);
        });
        return scenarios;
    }
    static setTableHeader(scenario) {
        if (!scenario.getHasDP()) { //if no data provider, then no need to set table header
            return scenario;
        }
        let object = scenario.getTestData()[0][0];
        let keys = Object.keys(object);
        let header = gherkinDocumentUtil_1.GherkinDocumentUtil.genTableHeader(keys, this.generateManyUniqueRandomIntegersWithChance(keys.length), this.generateOneUniqueRandomIntegersWithChance());
        scenario.tableHeader = header;
        return scenario;
    }
    static setTableHeaders(scenarios) {
        scenarios.forEach(scenario => {
            this.setTableHeader(scenario);
        });
        return scenarios;
    }
}
exports.QafDocumentUtil = QafDocumentUtil;
QafDocumentUtil.chance = new chance_1.default();
//# sourceMappingURL=qafDocumentUtil.js.map