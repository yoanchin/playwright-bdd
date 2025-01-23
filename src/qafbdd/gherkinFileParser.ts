import { Logger } from '../utils/logger';
import { StringUtil } from './stringUtil';
import { JsonUtil } from './jsonUtil';
import { Scenario } from './scenario';
import { StringTestStep } from './stringTestStep';
import { MetaDataHelper } from './metaDataHelper';
import * as path from 'path';
import { QafDocument } from './qafDocument';
enum Params {
    DATAFILE= "DATAFILE",
    SHEETNAME= "SHEETNAME",
    KEY= "KEY",
    HASHEADERROW= "HASHEADERROW",
    SQLQUERY= "SQLQUERY",
    BEANCLASS= "BEANCLASS",
    JSON_DATA_TABLE= "JSON_DATA_TABLE",
    DATAPROVIDER= "DATAPROVIDER",
    DATAPROVIDERCLASS= "DATAPROVIDERCLASS",
    FILTER= "FILTER",
    FROM= "FROM",
    TO= "TO",
    INDICES= "INDICES"
}

export class GherkinFileParser {
    private readonly logger: Logger = new Logger({ verbose: false }); 
    private readonly TAG: string = "@";
    private readonly COMMENT_CHARS: string = "#!|";
    public  readonly SCENARIO_OUTELINE: string = "Scenario Outline";
    public  readonly EXAMPLES: string = "EXAMPLES";
    public  readonly FEATURE: string = "Feature";

    public readonly STEP_DEF: string = "STEP-DEF";
	public readonly END: string = "END";
	public readonly TEST_DATA: string = "TEST-DATA";
	public readonly SCENARIO: string = "SCENARIO";
	public readonly DESCRIPTION: string = "desc";
    
    public readonly BACKGROUND: string = "Background";

    private includeGroups: string[] = [];
    private excludeGroups: string[] = [];

    public async qafGherkinFromPaths(scenarioFiles: string[], options:any): Promise<QafDocument[]> {
        let qafDocs: QafDocument[] = [];
        for (const scenarioFile of scenarioFiles) {
            let scenarios: Scenario[] = await this.parse(scenarioFile);
            for (const scenario of scenarios) {
                let data:any[][] = await MetaDataHelper.getDataByCmd(scenario.getMetadata(),options["relativeTo"]);
                scenario.setTestData(data);
            }
            qafDocs.push(new QafDocument(scenarios));
        }
        return qafDocs;
    }

    public async parseAndsetTestData(scenarioFile: string): Promise<Scenario[]> {
        let scenarios: Scenario[] = await this.parse(scenarioFile);
        for (const scenario of scenarios) {
            let data:any[][] = await MetaDataHelper.getData(scenario.getMetadata());
            scenario.setTestData(data);
        }
        return scenarios;
    }

    public async parse(scenarioFile: string): Promise<Scenario[]> {
        let scenarios: Scenario[] = [];
        const statements: any[][] = await this.parseFile(scenarioFile);
        const reference: string = this.getRelativePath(scenarioFile, "./");
        this.processStatements(statements, reference, scenarios);
        return scenarios;
    }

    public processStatements(statements: string[][], reference: string, scenarios: Scenario[]):void {
        for (let statementIndex = 0; statementIndex < statements.length; statementIndex++) {
            let type = statements[statementIndex][0].trim();

            // ignore blanks and statements outside scenario or step-def
            if (StringUtil.isBlank(type) || !(StringUtil.equalsIgnoreCase(type,this.FEATURE) || StringUtil.equalsIgnoreCase(type,this.SCENARIO)
                || StringUtil.equalsIgnoreCase(type,this.EXAMPLES))) {
                let nextSteptype = "";
                do {
                    statementIndex++;
                    if (statements.length > (statementIndex + 2)) {
                        nextSteptype = statements[statementIndex][0].trim();
                    } else {
                        nextSteptype = "END";
                    }
                    type = nextSteptype;
                } while (!(StringUtil.equalsIgnoreCase(nextSteptype,this.EXAMPLES) || StringUtil.equalsIgnoreCase(nextSteptype,this.SCENARIO)
                    || StringUtil.equalsIgnoreCase(nextSteptype,this.END)));
            }

            // Custom step definition
            if (StringUtil.equalsIgnoreCase(type,this.STEP_DEF)) {
                statementIndex = this.parseStepDef(statements, statementIndex, reference);
            } else if (StringUtil.equalsIgnoreCase(type,this.SCENARIO)) {
                statementIndex = this.parseScenario(statements, statementIndex, reference, scenarios);
            }
        }
    }


    protected parseScenario(statements: Object[][], statementIndex: number, reference: string, scenarios: Scenario[]): number {
        
        let description:string = statements[statementIndex].length > 2 ?  <string>statements[statementIndex][2] : "";
        let stepName:string = statements[statementIndex].length > 1 ? (<string>statements[statementIndex][1]).trim() : "";

        let lineNo = this.getLineNum(statements, statementIndex);

        // collect all steps of scenario
        let steps: StringTestStep[] = [];

        let metadata: any = []
        if (!StringUtil.isBlank(description)) {
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
            let dataProvider:boolean = MetaDataHelper.hasDP(metadata);
            // let scenario: Scenario = dataProvider ? new DataDrivenScenario(stepName, steps, metadata)
            //         : new Scenario(stepName, steps, metadata);
            let scenario: Scenario = new Scenario(stepName, steps, metadata, dataProvider);
            scenarios.push(scenario);
        } else {
            this.logger.log("Excluded SCENARIO - " + stepName + ":" + metadata.get(this.DESCRIPTION));
        }
        let nextSteptype:string = "";
        do {
            statementIndex++;
            lineNo = this.getLineNum(statements, statementIndex);

            let currStepName:string = <string> statements[statementIndex][0];
            if (!StringUtil.equalsIgnoreCase(currStepName,this.END)) {
                let step: StringTestStep = this.parseStepCall(statements[statementIndex], reference, lineNo);
                steps.push(step);
            }

            if (statements.length > (statementIndex + 2)) {
                nextSteptype = (<String> statements[statementIndex + 1][0]).trim();
            } else {
                nextSteptype = this.END; // EOF
            }
        } while (!(StringUtil.equalsIgnoreCase(nextSteptype,this.STEP_DEF) || StringUtil.equalsIgnoreCase(nextSteptype,this.SCENARIO)
                || StringUtil.equalsIgnoreCase(nextSteptype,this.END) || StringUtil.equalsIgnoreCase(nextSteptype,this.TEST_DATA)));

        return statementIndex;
    }

    protected parseStepDef(statements: Object[][], statementIndex: number, reference: string): number {
        return statementIndex;
    }

    protected parseStepCall(statement: any[], reference: string, lineNo: number): StringTestStep {
        const currStepName: string = statement[0] as string;
        let currStepArgs: any[] | null = null;
        const argString: string = statement[1] as string;
        if (!StringUtil.isBlank(argString)) {
            try {
                currStepArgs = JSON.parse(argString);
            } catch (error) {
                if (error instanceof SyntaxError) {
                    // Handle JSON parsing error
                    console.error(error.message + argString, error);
                }
            }
        }
        const currStepRes: string = statement.length > 2 ? statement[2] as string : "";

        const step: StringTestStep = new StringTestStep(currStepName, currStepArgs,reference,lineNo,currStepRes);

        return step;
    }

    private getLineNum(statements: Object[][], statementIndex: number): number {
        try {
            return (statements[statementIndex].length > 3 && statements[statementIndex][3] !== null)
                ? Number(statements[statementIndex][3]) : statementIndex;
        } catch (e) { // not a number???...
            return statementIndex;
        }
    }

    public async parseFile(strFile: string): Promise<any[][]> {
        let rows: any[][] = [];
        let background: any[][] = [];
        let lineNo: number = 0;
        let bglobalTags: boolean = true;
        let outline: boolean = false;
        let isBackground: boolean = false;
        let globalTags: string[] = [];
        let scenarioTags: string[] = [];
        let examplesTable: any[][] = [];

            this.logger.log(`loading feature file: ${strFile}`);
            const fs = require('fs');
            const readline = require('readline');
            const fileStream = await fs.createReadStream(strFile);
            const rl = await readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });
            let lastScenarioIndex: number = 0;

            for await (const line of rl){
                lineNo++;
                if (!(line.trim().toLowerCase() === "" || this.COMMENT_CHARS.includes(line.trim().charAt(0)))) {
                    let currLineBuffer: string = line.trim();
                    let cols: any[] = ["", "", "", lineNo];
                    let type: string = this.getType(currLineBuffer);
                    if (type === "") {
                        // this is a statement
                        cols[0] = outline ? this.convertParam(currLineBuffer) : currLineBuffer;
                    } else {
                        isBackground = false;
                        if (type === this.TAG) {
                            let tags: string[] = currLineBuffer.split(" ");
                            if (bglobalTags) {
                                globalTags.push(...tags);
                            } else {
                                scenarioTags.push(...tags);
                            }
                            continue;
                        }
                        if (type === this.BACKGROUND) {
                            isBackground = true;
                            continue;
                        }
                        let parts: string[] = currLineBuffer.split(":");
                        cols[0] = parts[0];
                        cols[1] = parts[1];
                        for (let i = 2; i < parts.length; i++) {
                            cols[1] = `${cols[1]}:${parts[i]}`;
                        }
                        if (type === this.EXAMPLES) {
                            let scenario: any = rows[lastScenarioIndex];
                            scenario[0] = this.SCENARIO;
                            let metadata: string = JsonUtil.toMap(scenario[2]);
                            let exampleMetadata: string = cols[1];
                            if (exampleMetadata != null && exampleMetadata.trim() !== "" && exampleMetadata.trim().startsWith("{")) {
                                Object.assign(metadata,JsonUtil.toMap(exampleMetadata));
                                scenario[2] = JsonUtil.toString(metadata);
                                continue;
                            }
                        } else {
                            scenarioTags.push(...globalTags);
                            let metadata: string = `{"groups":${JsonUtil.toString(scenarioTags)}}`;
                            cols[2] = metadata;
                            scenarioTags = [];
                            if (type === this.FEATURE) {
                                bglobalTags = false; 
                                outline = false;
                            } else {
                                outline = type === this.SCENARIO_OUTELINE;
                            }
                        }
                    }

                    if (examplesTable.length > 0) {
                        let lastStamtent: string = rows[rows.length - 1][0];
                        let lastStatementIndex: number = (lastStamtent.toLocaleLowerCase()===this.EXAMPLES.toLocaleLowerCase()) ? lastScenarioIndex : (rows.length - 1);
                        this.setExamples(rows[lastStatementIndex], examplesTable);
                        examplesTable = [];
                        if (lastStamtent.toLocaleLowerCase()===this.EXAMPLES.toLocaleLowerCase()) {
                            rows.pop();
                        }
                    }

                    if (isBackground) {
                        background.push(cols);
                    } else {
                        rows.push(cols);
                        let scenarioStarted: boolean = type.toLowerCase().includes(this.SCENARIO.toLowerCase());
                        if (scenarioStarted) {
                            lastScenarioIndex = rows.length - 1;
                            rows.push(...background);
                        }
                    }
                } else if (line != null && line.trim() !== "" && line.trim().charAt(0) === '|') {
                    this.addExample(line.trim(), examplesTable);
                }
            };

            if (rows.length > 0) {
                let lastStatementIndex: number = rows.length - 1;
                let lastStamtent: string = rows[lastStatementIndex][0];
                if (lastStamtent.toLocaleLowerCase()===this.EXAMPLES.toLocaleLowerCase()) {
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


    private setExamples(cols: any[], examplesTable: any[][]): void {
        // Determine if the examplesTable is a map (has more than one column) or a list (has one column)
        const isMap: boolean = examplesTable[0].length > 1;
        const isScenario: boolean = cols[0].trim().toLowerCase() === this.SCENARIO.toLowerCase();
        let data: any;

        if (isMap || isScenario) {
            // If it's a map or a scenario, process it as a list of key-value pairs
            const keys: string[] = examplesTable[0];
            const dataMapList: { [key: string]: any }[] = [];

            // Iterate over the rows in the examplesTable, skipping the header row
            for (let i = 1; i < examplesTable.length; i++) {
                const map: { [key: string]: any } = {};
                // Iterate over each cell in the row
                for (let k = 0; k < keys.length; k++) {
                    const val: any = examplesTable[i][k];
                    map[keys[k]] = val;
                }
                dataMapList.push(map);
            }
            data = dataMapList;
        } else {
            // If it's not a map, process it as a list of single values
            data = examplesTable.map(entry => entry[0]);
        }

        if (isScenario) {
            // If the cols represent a scenario, add the data to the scenario's metadata
            const metadata: any = JsonUtil.toMap(cols[2]);
            metadata[Params.JSON_DATA_TABLE] = JsonUtil.toString(data);
            cols[2] = JsonUtil.toString(metadata);
        } else {
            // If the cols represent a step, append the data to the step
            cols[0] = cols[0] + JsonUtil.toString(data);
        }
    }

    private addExample(line: string, examplesTable: any[][]): void {
        // Parse the line assuming it is in CSV format separated by '|'
        let rawData: any[] = StringUtil.parseCSV(line, '|');
        let cols: any[] = rawData.slice(1, rawData.length - 1);
        examplesTable.push(cols);
    }

    private convertParam(currLine: string): string {
        return currLine.replace(/>/g, '}').replace(/</g, '${');
    }

    private getType(line: string): string {
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

    public setExcludeGroups(excludeGroups: string[]): void {
        this.excludeGroups = excludeGroups;
    }

    public setIncludeGroups(includeGroups: string[]): void {
        this.includeGroups = includeGroups;
    }

    public include(metadata: { [key: string]: any }): boolean {
        return this.coreInclude(metadata,this.includeGroups);
    }

    public coreInclude(metadata: { [key: string]: any }, defInclude: string[]): boolean {
        // check for enabled
        if (metadata.hasOwnProperty("enabled") && !metadata["enabled"]) {
            return false;
        }

        const groups: Set<string> = new Set<string>(
            metadata.hasOwnProperty("GROUPS") ? metadata["GROUPS"] as string[] : []
        );

        let filteredGroups: Set<string> = new Set<string>();

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

    private getRelativePath(scenarioFile: string, basePath: string): string {
        return path.relative(basePath, scenarioFile);
    }
}