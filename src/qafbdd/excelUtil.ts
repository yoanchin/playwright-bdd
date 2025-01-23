import * as ExcelJS from 'exceljs';

export type SheetRange = { startRow: number, endRow: number, startCol: number, endCol: number };

export class ExcelUtil {

    public static async getSheetDimensionsFromFileAndSheetName(file: string, sheetName: string): Promise<SheetRange> {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(file);
        const sheet = workbook.getWorksheet(sheetName);
        if (!sheet) {
            throw new Error(`Worksheet ${sheetName} not found in ${file}`);
        }
        const startRow = sheet.rowCount > 0 ? 1 : 0;
        const endRow = sheet.rowCount;
        const startCol = sheet.columnCount > 0 ? 1 : 0;
        const endCol = sheet.columnCount;
        return { startRow, endRow, startCol, endCol };
    }

    public static getSheetDimensions(sheet: ExcelJS.Worksheet): SheetRange {
        const startRow = sheet.rowCount > 0 ? 1 : 0;;
        const endRow = sheet.rowCount;
        const startCol = sheet.columnCount > 0 ? 1 : 0;;
        const endCol = sheet.columnCount;
        return { startRow, endRow, startCol, endCol };
    }

    public static getFirstRow(sheet: ExcelJS.Worksheet, skipHeaderRow: boolean): number {
        const sheetRange: SheetRange = this.getSheetDimensions(sheet);
        let rowNumber = sheetRange.startRow;
        for (; rowNumber <= sheetRange.endRow; rowNumber++) {
            let isEmptyRow = true;
            for (let colNumber = sheetRange.startCol; colNumber <= sheetRange.endCol; colNumber++) {
                const cell = sheet.getCell(rowNumber, colNumber);
                if (cell.value !== null && cell.value !== undefined) {
                    isEmptyRow = false;
                    break;
                }
            }
            if (!isEmptyRow) {
                if (!skipHeaderRow) {
                    break;
                } else {
                    skipHeaderRow = false;
                }
            }
        }
        return rowNumber;
    }

    public static getFirstCol(sheet: ExcelJS.Worksheet): number {
        const firstRow: number = this.getFirstRow(sheet, false);
        const sheetRange: SheetRange = this.getSheetDimensions(sheet);
        for (let col = sheetRange.startCol; col <= sheetRange.endCol; col++) {
            const cell = sheet.getCell(firstRow, col);
            if (cell.value !== null && cell.value !== undefined) {
                return col;
            }
        }
        return 0;
    }

    public static async getSheetNames(file: string): Promise<string[]> {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(file);
        return workbook.worksheets.map(sheet => sheet.name);
    }

    public static async getExcelDataAsMap(file: string, sheetName: string): Promise<any[][]> {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(file);
        const sheet = workbook.getWorksheet(sheetName);
        if (!sheet) {
            throw new Error(`Worksheet ${sheetName} not found in ${file}`);
        }
        const sheetRange: SheetRange = this.getSheetDimensions(sheet);
        const startRow = sheetRange.startRow;
        const startCol = sheetRange.startCol;
        const endRow = sheetRange.endRow;
        const endCol = sheetRange.endCol;
        const tabArray = new Array(endRow - startRow).fill(null).map(() => new Array(1).fill(null));
        const colNames = new Array(endCol - startCol - 1).fill(null);
        let ci = 0;
        for (let i = startRow; i <= endRow; i++) {
            let cj = 0;
            if (i === startRow) {
                for (let j = startCol; j <= endCol; j++, cj++) {
                    colNames[cj] = sheet.getCell(i, j).value;
                }
            } else {
                let jsonString = '{';
                for (let j = startCol; j <= endCol; j++, cj++) {
                    if (jsonString.length > 1) {
                        jsonString += ',';
                    }
                    jsonString += `"${colNames[cj]}":"${sheet.getCell(i, j).value}"`;
                }
                jsonString += '}';
                tabArray[ci++][0] = JSON.parse(jsonString);
            }
        }
        return tabArray;
    }

    public static async getWorkbook(file: string): Promise<ExcelJS.Workbook> {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(file);
        return workbook;
    }

    public static async getTableDataAsMap(file: string, tableName: string, sheetName: string): Promise<any[][]> {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(file);
        const sheet = workbook.getWorksheet(sheetName);
        if (!sheet) {
            throw new Error(`Worksheet ${sheetName} not found in ${file}`);
        }
        const startCell = this.findCell(sheet, tableName, 1, 1);
        const startRow = startCell.r;
        const startCol = startCell.c;
        const endCell = this.findCell(sheet, tableName, startCol + 1, startRow + 1);
        const endRow = endCell.r;
        const endCol = endCell.c;
        const tabArray = new Array(endRow - startRow).fill(null).map(() => new Array(1).fill(null));
        const colNames = new Array(endCol - startCol - 1).fill(null);
        let ci = 0;
        for (let i = startRow; i <= endRow; i++) {
            let cj = 0;
            if (i === startRow) {
                for (let j = startCol + 1; j < endCol; j++, cj++) {
                    colNames[cj] = sheet.getCell(i, j).value;
                }
            } else {
                let jsonString = '{';
                for (let j = startCol + 1; j < endCol; j++, cj++) {
                    if (jsonString.length > 1) {
                        jsonString += ',';
                    }
                    jsonString += `"${colNames[cj]}":"${sheet.getCell(i, j).value}"`;
                }
                jsonString += '}';
                tabArray[ci++][0] = JSON.parse(jsonString);
            }
        }
        return tabArray;
    }

    public static findCell(sheet: ExcelJS.Worksheet, searchText: string, firstCol: number, firstRow: number): { r: number, c: number } {
        const sheetRange: SheetRange = this.getSheetDimensions(sheet);
        for (let j = firstRow; j <= sheetRange.endRow; j++) {
            for (let colNumber = firstCol; colNumber <= sheetRange.endCol; colNumber++) {
                const cell = sheet.getCell(j, colNumber);
                if (cell.value !== null && cell.value !== undefined && cell.value === searchText) {
                    return { r: j, c: colNumber };
                }
            }
        }
        return { r: 0, c: 0 };
    }
}