export class StringTestStep {

    protected name: string;
    protected actualArgs: any[]|null;
    protected fileName: string;
    protected lineNumber: number;
    protected resultParameterName: string;

    constructor(name: string, actualArgs: any[]|null, fileName: string, lineNumber: number, resultParameterName: string) {
        this.name = name;
        this.actualArgs = actualArgs;
        this.fileName = fileName;
        this.lineNumber = lineNumber;
        this.resultParameterName = resultParameterName;
    }

    public getName(): string {
        return this.name;
    }
    public getActualArgs(): Object[]|null {
        return this.actualArgs;
    }
    public getFileName(): string {
        return this.fileName;
    }
    public getLineNumber(): number {
        return this.lineNumber;
    }
    public getResultParameterName(): string {
        return this.resultParameterName;
    }
}
