import * as ExcelJS from 'exceljs';
export type SheetRange = {
    startRow: number;
    endRow: number;
    startCol: number;
    endCol: number;
};
export declare class ExcelUtil {
    static getSheetDimensionsFromFileAndSheetName(file: string, sheetName: string): Promise<SheetRange>;
    static getSheetDimensions(sheet: ExcelJS.Worksheet): SheetRange;
    static getFirstRow(sheet: ExcelJS.Worksheet, skipHeaderRow: boolean): number;
    static getFirstCol(sheet: ExcelJS.Worksheet): number;
    static getSheetNames(file: string): Promise<string[]>;
    static getExcelDataAsMap(file: string, sheetName: string): Promise<any[][]>;
    static getWorkbook(file: string): Promise<ExcelJS.Workbook>;
    static getTableDataAsMap(file: string, tableName: string, sheetName: string): Promise<any[][]>;
    static findCell(sheet: ExcelJS.Worksheet, searchText: string, firstCol: number, firstRow: number): {
        r: number;
        c: number;
    };
}
//# sourceMappingURL=excelUtil.d.ts.map