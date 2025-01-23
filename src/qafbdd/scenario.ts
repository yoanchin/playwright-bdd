import { StringTestStep } from './stringTestStep';
import * as Types from '@cucumber/messages';

export class Scenario {
    private static readonly SCANARIOBASEINDEX = 1000;
    private static scanariocount = 0;
    protected scenarioName: string;
    protected description: string = "";
    protected steps: StringTestStep[];
    private priority: number;
    protected m_groups: string[] = [];
    protected m_groupsDependedUpon: string[] = [];
    protected m_methodsDependedUpon: string[] = [];
    protected m_beforeGroups: string[] = [];
    protected m_afterGroups: string[] = [];
    // protected timeOut: number;
    // private signature: string;
    protected status: string = "";
    protected metadata: any;
    protected hasDP: boolean = false;
    protected testData :any[][] = [];
    public tableHeader?: Types.TableRow;
    public tableBody?: Types.TableRow[];
    constructor(testName: string, steps: StringTestStep[], metadata?: Map<string, Object>, hasDP?: boolean) {
        this.priority = Scenario.SCANARIOBASEINDEX + Scenario.scanariocount++;
        this.scenarioName = testName.trim();
        this.steps = steps;
        if (metadata) {
            this.metadata = metadata;
        }
        if (hasDP) {
            this.hasDP = hasDP;
        }
        this.init();
    }

    public setTestData(testData: any[][]){
        this.testData = testData;
    }
    
    public getTestData(){
        return this.testData;
    }
    public getHasDP() {
        return this.hasDP;
    }

    public getScenarioDescription() {
        return this.description;
    }

    public getScenarioName(){
        return this.scenarioName;
    }

    public getSteps() {
        return this.steps;
    }

    public getPriority() {
        return this.priority;
    }

    public getGroups() {
        return this.m_groups;
    }

    public getMetadata() {
        return this.metadata;
    }

    private init() {
        // Initialization logic goes here
    }
}