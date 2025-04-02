"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GherkinFileParser = void 0;
const logger_1 = require("../utils/logger");
const stringUtil_1 = require("./stringUtil");
const jsonUtil_1 = require("./jsonUtil");
const scenario_1 = require("./scenario");
const stringTestStep_1 = require("./stringTestStep");
const metaDataHelper_1 = require("./metaDataHelper");
const path = __importStar(require("path"));
const qafDocument_1 = require("./qafDocument");
var Params;
(function (Params) {
    Params["DATAFILE"] = "DATAFILE";
    Params["SHEETNAME"] = "SHEETNAME";
    Params["KEY"] = "KEY";
    Params["HASHEADERROW"] = "HASHEADERROW";
    Params["SQLQUERY"] = "SQLQUERY";
    Params["BEANCLASS"] = "BEANCLASS";
    Params["JSON_DATA_TABLE"] = "JSON_DATA_TABLE";
    Params["DATAPROVIDER"] = "DATAPROVIDER";
    Params["DATAPROVIDERCLASS"] = "DATAPROVIDERCLASS";
    Params["FILTER"] = "FILTER";
    Params["FROM"] = "FROM";
    Params["TO"] = "TO";
    Params["INDICES"] = "INDICES";
})(Params || (Params = {}));
class GherkinFileParser {
    constructor() {
        this.logger = new logger_1.Logger({ verbose: false });
        this.TAG = "@";
        this.COMMENT_CHARS = "#!|";
        this.SCENARIO_OUTELINE = "Scenario Outline";
        this.EXAMPLES = "EXAMPLES";
        this.FEATURE = "Feature";
        this.STEP_DEF = "STEP-DEF";
        this.END = "END";
        this.TEST_DATA = "TEST-DATA";
        this.SCENARIO = "SCENARIO";
        this.DESCRIPTION = "desc";
        this.BACKGROUND = "Background";
        this.includeGroups = [];
        this.excludeGroups = [];
    }
    async qafGherkinFromPaths(scenarioFiles, options) {
        let qafDocs = [];
        for (const scenarioFile of scenarioFiles) {
            let scenarios = await this.parse(scenarioFile);
            for (const scenario of scenarios) {
                let data = await metaDataHelper_1.MetaDataHelper.getDataByCmd(scenario.getMetadata(), options["relativeTo"]);
                scenario.setTestData(data);
            }
            qafDocs.push(new qafDocument_1.QafDocument(scenarios));
        }
        return qafDocs;
    }
    async parseAndsetTestData(scenarioFile) {
        let scenarios = await this.parse(scenarioFile);
        for (const scenario of scenarios) {
            let data = await metaDataHelper_1.MetaDataHelper.getData(scenario.getMetadata());
            scenario.setTestData(data);
        }
        return scenarios;
    }
    async parse(scenarioFile) {
        let scenarios = [];
        const statements = await this.parseFile(scenarioFile);
        const reference = this.getRelativePath(scenarioFile, "./");
        this.processStatements(statements, reference, scenarios);
        return scenarios;
    }
    processStatements(statements, reference, scenarios) {
        for (let statementIndex = 0; statementIndex < statements.length; statementIndex++) {
            let type = statements[statementIndex][0].trim();
            // ignore blanks and statements outside scenario or step-def
            if (stringUtil_1.StringUtil.isBlank(type) || !(stringUtil_1.StringUtil.equalsIgnoreCase(type, this.FEATURE) || stringUtil_1.StringUtil.equalsIgnoreCase(type, this.SCENARIO)
                || stringUtil_1.StringUtil.equalsIgnoreCase(type, this.EXAMPLES))) {
                let nextSteptype = "";
                do {
                    statementIndex++;
                    if (statements.length > (statementIndex + 2)) {
                        nextSteptype = statements[statementIndex][0].trim();
                    }
                    else {
                        nextSteptype = "END";
                    }
                    type = nextSteptype;
                } while (!(stringUtil_1.StringUtil.equalsIgnoreCase(nextSteptype, this.EXAMPLES) || stringUtil_1.StringUtil.equalsIgnoreCase(nextSteptype, this.SCENARIO)
                    || stringUtil_1.StringUtil.equalsIgnoreCase(nextSteptype, this.END)));
            }
            // Custom step definition
            if (stringUtil_1.StringUtil.equalsIgnoreCase(type, this.STEP_DEF)) {
                statementIndex = this.parseStepDef(statements, statementIndex, reference);
            }
            else if (stringUtil_1.StringUtil.equalsIgnoreCase(type, this.SCENARIO)) {
                statementIndex = this.parseScenario(statements, statementIndex, reference, scenarios);
            }
        }
    }
    parseScenario(statements, statementIndex, reference, scenarios) {
        let description = statements[statementIndex].length > 2 ? statements[statementIndex][2] : "";
        let stepName = statements[statementIndex].length > 1 ? statements[statementIndex][1].trim() : "";
        let lineNo = this.getLineNum(statements, statementIndex);
        // collect all steps of scenario
        let steps = [];
        let metadata = [];
        if (!stringUtil_1.StringUtil.isBlank(description)) {
            metadata = JSON.parse(description);
        }
        metadata["reference"] = reference;
        metadata["lineNo"] = lineNo;
        /**
         * check enabled flag in meta-data and apply groups filter if configured
         * in xml configuration file. the custom meta-data filter will covered
         * in method filter where it will not include groups from xml
         * configuration file.
         */
        if (this.include(metadata)) {
            let dataProvider = metaDataHelper_1.MetaDataHelper.hasDP(metadata);
            // let scenario: Scenario = dataProvider ? new DataDrivenScenario(stepName, steps, metadata)
            //         : new Scenario(stepName, steps, metadata);
            let scenario = new scenario_1.Scenario(stepName, steps, dataProvider, metadata);
            scenarios.push(scenario);
        }
        else {
            this.logger.log("Excluded SCENARIO - " + stepName + ":" + metadata.get(this.DESCRIPTION));
        }
        let nextSteptype = "";
        do {
            statementIndex++;
            lineNo = this.getLineNum(statements, statementIndex);
            let currStepName = statements[statementIndex][0];
            if (!stringUtil_1.StringUtil.equalsIgnoreCase(currStepName, this.END)) {
                let step = this.parseStepCall(statements[statementIndex], reference, lineNo);
                steps.push(step);
            }
            if (statements.length > (statementIndex + 2)) {
                nextSteptype = statements[statementIndex + 1][0].trim();
            }
            else {
                nextSteptype = this.END; // EOF
            }
        } while (!(stringUtil_1.StringUtil.equalsIgnoreCase(nextSteptype, this.STEP_DEF) || stringUtil_1.StringUtil.equalsIgnoreCase(nextSteptype, this.SCENARIO)
            || stringUtil_1.StringUtil.equalsIgnoreCase(nextSteptype, this.END) || stringUtil_1.StringUtil.equalsIgnoreCase(nextSteptype, this.TEST_DATA)));
        return statementIndex;
    }
    parseStepDef(statements, statementIndex, reference) {
        return statementIndex;
    }
    parseStepCall(statement, reference, lineNo) {
        const currStepName = statement[0];
        let currStepArgs = null;
        const argString = statement[1];
        if (!stringUtil_1.StringUtil.isBlank(argString)) {
            try {
                currStepArgs = JSON.parse(argString);
            }
            catch (error) {
                if (error instanceof SyntaxError) {
                    // Handle JSON parsing error
                    console.error(error.message + argString, error);
                }
            }
        }
        const currStepRes = statement.length > 2 ? statement[2] : "";
        const step = new stringTestStep_1.StringTestStep(currStepName, currStepArgs, reference, lineNo, currStepRes);
        return step;
    }
    getLineNum(statements, statementIndex) {
        try {
            return (statements[statementIndex].length > 3 && statements[statementIndex][3] !== null)
                ? Number(statements[statementIndex][3]) : statementIndex;
        }
        catch (e) { // not a number???...
            return statementIndex;
        }
    }
    async parseFile(strFile) {
        let rows = [];
        let background = [];
        let lineNo = 0;
        let bglobalTags = true;
        let outline = false;
        let isBackground = false;
        let globalTags = [];
        let scenarioTags = [];
        let examplesTable = [];
        this.logger.log(`loading feature file: ${strFile}`);
        const fs = require('fs');
        const readline = require('readline');
        const fileStream = await fs.createReadStream(strFile);
        const rl = await readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        let lastScenarioIndex = 0;
        for await (const line of rl) {
            lineNo++;
            if (!(line.trim().toLowerCase() === "" || this.COMMENT_CHARS.includes(line.trim().charAt(0)))) {
                let currLineBuffer = line.trim();
                let cols = ["", "", "", lineNo];
                let type = this.getType(currLineBuffer);
                if (type === "") {
                    // this is a statement
                    cols[0] = outline ? this.convertParam(currLineBuffer) : currLineBuffer;
                }
                else {
                    isBackground = false;
                    if (type === this.TAG) {
                        let tags = currLineBuffer.split(" ");
                        if (bglobalTags) {
                            globalTags.push(...tags);
                        }
                        else {
                            scenarioTags.push(...tags);
                        }
                        continue;
                    }
                    if (type === this.BACKGROUND) {
                        isBackground = true;
                        continue;
                    }
                    let parts = currLineBuffer.split(":");
                    cols[0] = parts[0];
                    cols[1] = parts[1];
                    for (let i = 2; i < parts.length; i++) {
                        cols[1] = `${cols[1]}:${parts[i]}`;
                    }
                    if (type === this.EXAMPLES) {
                        let scenario = rows[lastScenarioIndex];
                        scenario[0] = this.SCENARIO;
                        let metadata = jsonUtil_1.JsonUtil.toMap(scenario[2]);
                        let exampleMetadata = cols[1];
                        if (exampleMetadata != null && exampleMetadata.trim() !== "" && exampleMetadata.trim().startsWith("{")) {
                            Object.assign(metadata, jsonUtil_1.JsonUtil.toMap(exampleMetadata));
                            scenario[2] = jsonUtil_1.JsonUtil.toString(metadata);
                            continue;
                        }
                    }
                    else {
                        scenarioTags.push(...globalTags);
                        let metadata = `{"groups":${jsonUtil_1.JsonUtil.toString(scenarioTags)}}`;
                        cols[2] = metadata;
                        scenarioTags = [];
                        if (type === this.FEATURE) {
                            bglobalTags = false;
                            outline = false;
                        }
                        else {
                            outline = type === this.SCENARIO_OUTELINE;
                        }
                    }
                }
                if (examplesTable.length > 0) {
                    let lastStamtent = rows[rows.length - 1][0];
                    let lastStatementIndex = (lastStamtent.toLocaleLowerCase() === this.EXAMPLES.toLocaleLowerCase()) ? lastScenarioIndex : (rows.length - 1);
                    this.setExamples(rows[lastStatementIndex], examplesTable);
                    examplesTable = [];
                    if (lastStamtent.toLocaleLowerCase() === this.EXAMPLES.toLocaleLowerCase()) {
                        rows.pop();
                    }
                }
                if (isBackground) {
                    background.push(cols);
                }
                else {
                    rows.push(cols);
                    let scenarioStarted = type.toLowerCase().includes(this.SCENARIO.toLowerCase());
                    if (scenarioStarted) {
                        lastScenarioIndex = rows.length - 1;
                        rows.push(...background);
                    }
                }
            }
            else if (line != null && line.trim() !== "" && line.trim().charAt(0) === '|') {
                this.addExample(line.trim(), examplesTable);
            }
        }
        ;
        if (rows.length > 0) {
            let lastStatementIndex = rows.length - 1;
            let lastStamtent = rows[lastStatementIndex][0];
            if (lastStamtent.toLocaleLowerCase() === this.EXAMPLES.toLocaleLowerCase()) {
                rows.pop();
                lastStatementIndex = lastScenarioIndex;
            }
            if (examplesTable.length > 0) {
                this.setExamples(rows[lastStatementIndex], examplesTable);
                examplesTable = [];
            }
        }
        rows.push(["END", "", "", lineNo + 1]); // indicate end of BDD
        return rows;
    }
    setExamples(cols, examplesTable) {
        // Determine if the examplesTable is a map (has more than one column) or a list (has one column)
        const isMap = examplesTable[0].length > 1;
        const isScenario = cols[0].trim().toLowerCase() === this.SCENARIO.toLowerCase();
        let data;
        if (isMap || isScenario) {
            // If it's a map or a scenario, process it as a list of key-value pairs
            const keys = examplesTable[0];
            const dataMapList = [];
            // Iterate over the rows in the examplesTable, skipping the header row
            for (let i = 1; i < examplesTable.length; i++) {
                const map = {};
                // Iterate over each cell in the row
                for (let k = 0; k < keys.length; k++) {
                    const val = examplesTable[i][k];
                    map[keys[k]] = val;
                }
                dataMapList.push(map);
            }
            data = dataMapList;
        }
        else {
            // If it's not a map, process it as a list of single values
            data = examplesTable.map(entry => entry[0]);
        }
        if (isScenario) {
            // If the cols represent a scenario, add the data to the scenario's metadata
            const metadata = jsonUtil_1.JsonUtil.toMap(cols[2]);
            metadata[Params.JSON_DATA_TABLE] = jsonUtil_1.JsonUtil.toString(data);
            cols[2] = jsonUtil_1.JsonUtil.toString(metadata);
        }
        else {
            // If the cols represent a step, append the data to the step
            cols[0] = cols[0] + jsonUtil_1.JsonUtil.toString(data);
        }
    }
    addExample(line, examplesTable) {
        // Parse the line assuming it is in CSV format separated by '|'
        let rawData = stringUtil_1.StringUtil.parseCSV(line, '|');
        let cols = rawData.slice(1, rawData.length - 1);
        examplesTable.push(cols);
    }
    convertParam(currLine) {
        return currLine.replace(/>/g, '}').replace(/</g, '${');
    }
    getType(line) {
        if (line.toLowerCase().startsWith(this.TAG.toLowerCase())) {
            return this.TAG;
        }
        if (line.toLowerCase().startsWith(this.SCENARIO_OUTELINE.toLowerCase())) {
            return this.SCENARIO_OUTELINE;
        }
        if (line.toLowerCase().startsWith(this.SCENARIO.toLowerCase())) {
            return this.SCENARIO;
        }
        if (line.toLowerCase().startsWith(this.EXAMPLES.toLowerCase())) {
            return this.EXAMPLES;
        }
        if (line.toLowerCase().startsWith(this.FEATURE.toLowerCase())) {
            return this.FEATURE;
        }
        if (line.toLowerCase().startsWith(this.BACKGROUND.toLowerCase())) {
            return this.BACKGROUND;
        }
        return "";
    }
    setExcludeGroups(excludeGroups) {
        this.excludeGroups = excludeGroups;
    }
    setIncludeGroups(includeGroups) {
        this.includeGroups = includeGroups;
    }
    include(metadata) {
        return this.coreInclude(metadata, this.includeGroups);
    }
    coreInclude(metadata, defInclude) {
        // check for enabled
        if (metadata.hasOwnProperty("enabled") && !metadata["enabled"]) {
            return false;
        }
        const groups = new Set(metadata.hasOwnProperty("GROUPS") ? metadata["GROUPS"] : []);
        let filteredGroups = new Set();
        // Manually implement retainAll functionality
        groups.forEach(group => {
            if (this.includeGroups.includes(group)) {
                filteredGroups.add(group);
            }
        });
        groups.clear(); // Clear the original set
        // Add back the filtered elements
        filteredGroups.forEach(group => groups.add(group));
        // Continue with the rest of the logic...
        groups.forEach(group => {
            if (this.excludeGroups.includes(group)) {
                groups.delete(group);
            }
        });
        return (!groups.size || (this.includeGroups.length === 0 && defInclude.length === 0 && this.excludeGroups.length === 0));
    }
    getRelativePath(scenarioFile, basePath) {
        return path.relative(basePath, scenarioFile);
    }
}
exports.GherkinFileParser = GherkinFileParser;
//# sourceMappingURL=gherkinFileParser.js.map