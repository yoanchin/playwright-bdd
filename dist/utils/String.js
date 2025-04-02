"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTestCaseIDFromFirstElement = extractTestCaseIDFromFirstElement;
exports.extractTestCaseID = extractTestCaseID;
function extractTestCaseIDFromFirstElement(arr) {
    if (arr.length === 0) {
        return '';
    }
    return extractTestCaseID(arr[0]);
}
function extractTestCaseID(input) {
    const index = input.indexOf('@');
    if (index !== -1 && index < input.length - 1) {
        return input.substring(index + 1) + " | ";
    }
    return '';
}
//# sourceMappingURL=String.js.map