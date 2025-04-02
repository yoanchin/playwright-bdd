"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LodashUtil = void 0;
const qafDocumentUtil_1 = require("./qafDocumentUtil");
const lodash_1 = __importDefault(require("lodash"));
const gherkinDocumentUtil_1 = require("./gherkinDocumentUtil");
class LodashUtil {
    static setTable(envelope, qafDocument) {
        qafDocumentUtil_1.QafDocumentUtil.setTableHeaders(qafDocument.getScenarios());
        qafDocumentUtil_1.QafDocumentUtil.setTableBodys(qafDocument.getScenarios());
        let scenarios = qafDocument.getScenarios();
        if (scenarios.length == 0) {
            return envelope;
        }
        let obj = envelope.gherkinDocument;
        const propertyName = 'feature.children';
        // Check if the object has the property and if the property is an array
        if (lodash_1.default.has(obj, propertyName) && lodash_1.default.isArray(obj['feature']?.['children'])) {
            // Filter out non-scenario nodes
            const filteredChildren = lodash_1.default.filter(obj['feature']['children'], (child) => child.scenario !== undefined);
            // Iterate over the array and add a new property node to each element
            lodash_1.default.forEach(filteredChildren, (item, index) => {
                if (scenarios[index] && scenarios[index].getHasDP()) {
                    // Add a new property node and set it to a new object
                    lodash_1.default.set(item, 'scenario.examples[0].tableHeader', qafDocument.getScenarios()[index].tableHeader);
                    lodash_1.default.set(item, 'scenario.examples[0].tableBody', qafDocument.getScenarios()[index].tableBody);
                }
            });
        }
        return envelope;
    }
    static genEnvelopesWithPickles(envelope, qafDocument) {
        let EnvelopesWithPickles = [];
        this.genPickles(envelope, qafDocument).forEach((pickle) => {
            EnvelopesWithPickles.push({
                pickle: pickle
            });
        });
        return EnvelopesWithPickles;
    }
    static genPickles(envelope, qafDocument) {
        let pickles = [];
        //this.setTable(envelope,qafDocument);
        let obj = envelope.gherkinDocument;
        qafDocument.getScenarios().forEach((scenario, index_s_of_qaf) => {
            if (scenario.getHasDP()) {
                //loop through the scenarios and generate pickles
                // loop table body cells and one cell generate one pickle
                scenario.tableBody?.forEach((tableRow, index_tb) => {
                    let tbody_id = tableRow.id;
                    let uri = gherkinDocumentUtil_1.GherkinDocumentUtil.getUriFromGherkinDocument(obj), name = scenario.getScenarioName(), language = "en", astNodeIdsForSteps = [], types = [], texts = [], tagNames = [], astNodeIds = [], ids = [], stepArguments = [];
                    //filter backgrounds and scenarios
                    const filteredBackgrounds = lodash_1.default.filter(obj['feature']?.['children'], (child) => child.background !== undefined);
                    lodash_1.default.forEach(filteredBackgrounds, (item, index_b) => {
                        //todo add step to pickle
                        let steps = item?.['background']?.['steps'] || [];
                        lodash_1.default.forEach(steps, (step, index_s) => {
                            let astNodeIdsOfOneSteps_b = [];
                            types.push(step.keywordType);
                            let changedText_b = this.replaceParamWithValue(step.text, scenario.getTestData()[index_tb]);
                            texts.push(changedText_b.result);
                            if (!changedText_b.changed) {
                                astNodeIdsOfOneSteps_b = [step.id, tbody_id];
                            }
                            else {
                                astNodeIdsOfOneSteps_b = [step.id, tbody_id];
                            }
                            astNodeIdsForSteps.push(astNodeIdsOfOneSteps_b);
                            //if step has argument, add it to stepArguments
                            //else add undefined
                            LodashUtil.addStepArguments(step, stepArguments);
                        });
                    });
                    const filteredScenarios = lodash_1.default.filter(obj['feature']?.['children'], (child) => child.scenario !== undefined);
                    let scenario_id = filteredScenarios[index_s_of_qaf]?.['scenario']?.['id'] || "";
                    let steps = filteredScenarios[index_s_of_qaf]?.['scenario']?.['steps'] || [];
                    ids = [scenario_id, tbody_id];
                    lodash_1.default.forEach(steps, (step, index_s) => {
                        let astNodeIdsOfOneSteps = [];
                        types.push(step.keywordType);
                        let changedText = this.replaceParamWithValue(step.text, scenario.getTestData()[index_tb]);
                        texts.push(changedText.result);
                        if (!changedText.changed) {
                            astNodeIdsOfOneSteps = [step.id, tbody_id];
                        }
                        else {
                            astNodeIdsOfOneSteps = [step.id, tbody_id];
                        }
                        astNodeIdsForSteps.push(astNodeIdsOfOneSteps);
                        //if step has argument, add it to stepArguments
                        //else add undefined
                        LodashUtil.addStepArguments(step, stepArguments);
                    });
                    // add tags of feature and scenario
                    lodash_1.default.forEach(obj['feature']?.['tags'], (item_tag_f, index_t) => {
                        tagNames.push(item_tag_f.name);
                        astNodeIds.push(item_tag_f.id);
                    });
                    // add tags of scenario
                    lodash_1.default.forEach(filteredScenarios[index_s_of_qaf]?.['scenario']?.['tags'], (item_tag_s, index_t) => {
                        tagNames.push(item_tag_s.name);
                        astNodeIds.push(item_tag_s.id);
                    });
                    pickles.push(gherkinDocumentUtil_1.GherkinDocumentUtil.genPickle(uri, name, language, astNodeIdsForSteps, types, texts, tagNames, astNodeIds, ids, stepArguments));
                });
            }
        });
        return pickles;
    }
    static genTableAndPickles(envelope, qafDocument) {
        let pickles = [];
        this.setTable(envelope, qafDocument);
        let obj = envelope.gherkinDocument;
        qafDocument.getScenarios().forEach((scenario, index_s_of_qaf) => {
            if (scenario.getHasDP()) {
                //loop through the scenarios and generate pickles
                // loop table body cells and one cell generate one pickle
                scenario.tableBody?.forEach((tableRow, index_tb) => {
                    let tbody_id = tableRow.id;
                    let uri = gherkinDocumentUtil_1.GherkinDocumentUtil.getUriFromGherkinDocument(obj), name = scenario.getScenarioName(), language = "en", astNodeIdsForSteps = [], types = [], texts = [], tagNames = [], astNodeIds = [], ids = [], stepArguments = [];
                    //filter backgrounds and scenarios
                    const filteredBackgrounds = lodash_1.default.filter(obj['feature']?.['children'], (child) => child.background !== undefined);
                    lodash_1.default.forEach(filteredBackgrounds, (item, index_b) => {
                        //todo add step to pickle
                        let steps = item?.['background']?.['steps'] || [];
                        lodash_1.default.forEach(steps, (step, index_s) => {
                            let astNodeIdsOfOneSteps_b = [];
                            types.push(step.keywordType);
                            let changedText_b = this.replaceParamWithValue(step.text, scenario.getTestData()[index_tb]);
                            texts.push(changedText_b.result);
                            if (!changedText_b.changed) {
                                astNodeIdsOfOneSteps_b = [step.id, tbody_id];
                            }
                            else {
                                astNodeIdsOfOneSteps_b = [step.id, tbody_id];
                            }
                            astNodeIdsForSteps.push(astNodeIdsOfOneSteps_b);
                            //if step has argument, add it to stepArguments
                            //else add undefined
                            LodashUtil.addStepArguments(step, stepArguments);
                        });
                    });
                    const filteredScenarios = lodash_1.default.filter(obj['feature']?.['children'], (child) => child.scenario !== undefined);
                    let scenario_id = filteredScenarios[index_s_of_qaf]?.['scenario']?.['id'] || "";
                    let steps = filteredScenarios[index_s_of_qaf]?.['scenario']?.['steps'] || [];
                    ids = [scenario_id, tbody_id];
                    lodash_1.default.forEach(steps, (step, index_s) => {
                        let astNodeIdsOfOneSteps = [];
                        types.push(step.keywordType);
                        let changedText = this.replaceParamWithValue(step.text, scenario.getTestData()[index_tb]);
                        texts.push(changedText.result);
                        if (!changedText.changed) {
                            astNodeIdsOfOneSteps = [step.id, tbody_id];
                        }
                        else {
                            astNodeIdsOfOneSteps = [step.id, tbody_id];
                        }
                        astNodeIdsForSteps.push(astNodeIdsOfOneSteps);
                        //if step has argument, add it to stepArguments
                        //else add undefined
                        LodashUtil.addStepArguments(step, stepArguments);
                    });
                    // add tags of feature and scenario
                    lodash_1.default.forEach(obj['feature']?.['tags'], (item_tag_f, index_t) => {
                        tagNames.push(item_tag_f.name);
                        astNodeIds.push(item_tag_f.id);
                    });
                    // add tags of scenario
                    lodash_1.default.forEach(filteredScenarios[index_s_of_qaf]?.['scenario']?.['tags'], (item_tag_s, index_t) => {
                        tagNames.push(item_tag_s.name);
                        astNodeIds.push(item_tag_s.id);
                    });
                    pickles.push(gherkinDocumentUtil_1.GherkinDocumentUtil.genPickle(uri, name, language, astNodeIdsForSteps, types, texts, tagNames, astNodeIds, ids, stepArguments));
                });
            }
        });
        return pickles;
    }
    static addStepArguments(step, stepArguments) {
        let stepArgument = "";
        if (step.dataTable) {
            stepArgument = this.convertDatatabletoPickleTable(step.dataTable);
        }
        else {
            stepArgument = undefined;
        }
        stepArguments.push(stepArgument);
    }
    static replaceParamWithValue(original, values) {
        let changed = false;
        let matches = original.match(/<([^>]+)>/g) || [];
        if (matches.length > 0) {
            changed = true;
            for (let i = 0; i < matches.length; i++) {
                let key = this.convertParam(matches[i]);
                let value = values[0][`${key}`];
                if (value) {
                    original = original.replace(`<${key}>`, value);
                }
            }
        }
        return { result: original, changed: changed };
    }
    static convertParam(currLine) {
        return currLine.replace(/>/g, '').replace(/</g, '');
    }
    static convertDatatabletoPickleTable(dataTable) {
        let temprows = [];
        lodash_1.default.forEach(dataTable.rows, (row) => {
            let newCells = [];
            lodash_1.default.forEach(row.cells, (cell) => {
                let newCell = lodash_1.default.omit(cell, 'location');
                newCells.push(newCell);
            });
            temprows.push({
                cells: newCells,
            });
        });
        let pickleTable = {
            dataTable: {
                rows: temprows,
            }
        };
        return pickleTable;
    }
}
exports.LodashUtil = LodashUtil;
//# sourceMappingURL=lodashUtil.js.map