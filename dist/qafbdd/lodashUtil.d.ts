import { QafDocument } from "./qafDocument";
import * as Types from '@cucumber/messages';
export declare class LodashUtil {
    static setTable(envelope: Types.Envelope, qafDocument: QafDocument): Types.Envelope;
    static genEnvelopesWithPickles(envelope: Types.Envelope, qafDocument: QafDocument): Types.Envelope[];
    static genPickles(envelope: Types.Envelope, qafDocument: QafDocument): Types.Pickle[];
    static genTableAndPickles(envelope: Types.Envelope, qafDocument: QafDocument): Types.Pickle[];
    private static addStepArguments;
    static replaceParamWithValue(original: string, values: any[]): {
        result: string;
        changed: boolean;
    };
    static convertParam(currLine: string): string;
    static convertDatatabletoPickleTable(dataTable: Types.DataTable): Types.PickleStepArgument;
}
//# sourceMappingURL=lodashUtil.d.ts.map