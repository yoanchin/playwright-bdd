import { Scenario } from './scenario';
import { StringTestStep } from './stringTestStep';
import { QafDocument } from './qafDocument';
export declare class GherkinFileParser {
    private readonly logger;
    private readonly TAG;
    private readonly COMMENT_CHARS;
    readonly SCENARIO_OUTELINE: string;
    readonly EXAMPLES: string;
    readonly FEATURE: string;
    readonly STEP_DEF: string;
    readonly END: string;
    readonly TEST_DATA: string;
    readonly SCENARIO: string;
    readonly DESCRIPTION: string;
    readonly BACKGROUND: string;
    private includeGroups;
    private excludeGroups;
    qafGherkinFromPaths(scenarioFiles: string[], options: any): Promise<QafDocument[]>;
    parseAndsetTestData(scenarioFile: string): Promise<Scenario[]>;
    parse(scenarioFile: string): Promise<Scenario[]>;
    processStatements(statements: string[][], reference: string, scenarios: Scenario[]): void;
    protected parseScenario(statements: Object[][], statementIndex: number, reference: string, scenarios: Scenario[]): number;
    protected parseStepDef(statements: Object[][], statementIndex: number, reference: string): number;
    protected parseStepCall(statement: any[], reference: string, lineNo: number): StringTestStep;
    private getLineNum;
    parseFile(strFile: string): Promise<any[][]>;
    private setExamples;
    private addExample;
    private convertParam;
    private getType;
    setExcludeGroups(excludeGroups: string[]): void;
    setIncludeGroups(includeGroups: string[]): void;
    include(metadata: {
        [key: string]: any;
    }): boolean;
    coreInclude(metadata: {
        [key: string]: any;
    }, defInclude: string[]): boolean;
    private getRelativePath;
}
//# sourceMappingURL=gherkinFileParser.d.ts.map