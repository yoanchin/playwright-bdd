import { StringTestStep } from './stringTestStep';
import * as Types from '@cucumber/messages';
export declare class Scenario {
    private static readonly SCANARIOBASEINDEX;
    private static scanariocount;
    protected scenarioName: string;
    protected description: string;
    protected steps: StringTestStep[];
    private priority;
    protected m_groups: string[];
    protected m_groupsDependedUpon: string[];
    protected m_methodsDependedUpon: string[];
    protected m_beforeGroups: string[];
    protected m_afterGroups: string[];
    protected status: string;
    protected metadata: any;
    protected hasDP: boolean;
    protected testData: any[][];
    tableHeader?: Types.TableRow;
    tableBody?: Types.TableRow[];
    constructor(testName: string, steps: StringTestStep[], hasDP: boolean, metadata?: Map<string, Object>);
    setTestData(testData: any[][]): void;
    getTestData(): any[][];
    getHasDP(): boolean;
    getScenarioDescription(): string;
    getScenarioName(): string;
    getSteps(): StringTestStep[];
    getPriority(): number;
    getGroups(): string[];
    getMetadata(): any;
    private init;
}
//# sourceMappingURL=scenario.d.ts.map