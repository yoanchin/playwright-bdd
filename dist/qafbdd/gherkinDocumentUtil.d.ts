import * as Types from '@cucumber/messages';
export declare class GherkinDocumentUtil {
    static getUriFromGherkinDocument(gherkinDocument: Types.GherkinDocument): string;
    static getNameFromScenario(scenario: Types.Scenario): string;
    static genPickle(uri: string, name: string, language: string, astNodeIdsForSteps: string[][], types: Types.PickleStepType[], text: string[], tagNames: string[], astNodeIds: string[], ids: string[], stepArguments: Types.PickleStepArgument[]): Types.Pickle;
    static genPickleTags(tagNames: string[], astNodeIds: string[]): Types.PickleTag[];
    static genPickleSteps(astNodeIds: string[][], types: Types.PickleStepType[], texts: string[], stepArguments: Types.PickleStepArgument[]): Types.PickleStep[];
    static genPickleStep(astNodeIds: string[], type: Types.PickleStepType, text: string, argu?: Types.PickleStepArgument): Types.PickleStep;
    static genAstNodeIds(ids: string[]): string[];
    static genTableHeader(values: string[], lineforCells: number[], lineforHeader: number): Types.TableRow;
    static genTableBody(values: string[][], lineforCells: number[][], lineforHeader: number[]): Types.TableRow[];
    static genTableRow(values: string[], lineforCells: number[], lineforHeader: number): Types.TableRow;
    static genTableCells(value: string[], line: number[]): Types.TableCell[];
    static genTableCell(value: string, line: number): Types.TableCell;
    static genLocation(line: number): Types.Location;
}
//# sourceMappingURL=gherkinDocumentUtil.d.ts.map