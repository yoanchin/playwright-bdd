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
exports.ExcelUtil = void 0;
const ExcelJS = __importStar(require("exceljs"));
class ExcelUtil {
    static async getSheetDimensionsFromFileAndSheetName(file, sheetName) {
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
    static getSheetDimensions(sheet) {
        const startRow = sheet.rowCount > 0 ? 1 : 0;
        ;
        const endRow = sheet.rowCount;
        const startCol = sheet.columnCount > 0 ? 1 : 0;
        ;
        const endCol = sheet.columnCount;
        return { startRow, endRow, startCol, endCol };
    }
    static getFirstRow(sheet, skipHeaderRow) {
        const sheetRange = this.getSheetDimensions(sheet);
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
                }
                else {
                    skipHeaderRow = false;
                }
            }
        }
        return rowNumber;
    }
    static getFirstCol(sheet) {
        const firstRow = this.getFirstRow(sheet, false);
        const sheetRange = this.getSheetDimensions(sheet);
        for (let col = sheetRange.startCol; col <= sheetRange.endCol; col++) {
            const cell = sheet.getCell(firstRow, col);
            if (cell.value !== null && cell.value !== undefined) {
                return col;
            }
        }
        return 0;
    }
    static async getSheetNames(file) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(file);
        return workbook.worksheets.map(sheet => sheet.name);
    }
    static async getExcelDataAsMap(file, sheetName) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(file);
        const sheet = workbook.getWorksheet(sheetName);
        if (!sheet) {
            throw new Error(`Worksheet ${sheetName} not found in ${file}`);
        }
        const sheetRange = this.getSheetDimensions(sheet);
        const startRow = sheetRange.startRow;
        const startCol = sheetRange.startCol;
        const endRow = sheetRange.endRow;
        const endCol = sheetRange.endCol;
        const tabArray = new Array(endRow - startRow).fill(null).map(() => new Array(1).fill(null));
        const colNames = new Array(endCol - startCol - 1).fill(null);
        let ci = 0;
        const arrayExceptEmpty = new Array();
        const colNamesExceptEmpty = new Array();
        for (let i = startRow; i <= endRow; i++) {
            let cj = 0;
            if (i === startRow) {
                for (let j = startCol; j <= endCol; j++, cj++) {
                    colNames[cj] = sheet.getCell(i, j).value;
                    if (colNames[cj] !== null && typeof colNames[cj] === 'string') {
                        colNames[cj] = colNames[cj].trim();
                    }
                    else {
                        continue;
                    }
                }
                // check if the array is empty， if no empty, then push the array to colNamesExceptEmpty
                for (let i = 0; i < colNames.length; i++) {
                    if (colNames[i] !== null) {
                        colNamesExceptEmpty.push(colNames[i]);
                    }
                }
            }
            else {
                let skip = true;
                let jsonString = '{';
                for (let j = startCol; j <= colNamesExceptEmpty.length; j++, cj++) {
                    if (jsonString.length > 1) {
                        jsonString += ',';
                    }
                    const cellValue = sheet.getCell(i, j).value;
                    if (cellValue === null || (typeof cellValue === 'string' && cellValue.trim() === '')) {
                        // cellValue replace with empty string
                        jsonString += `"${colNamesExceptEmpty[cj]}":"${sheet.getCell(i, j).value}"`;
                    }
                    else {
                        skip = false;
                        jsonString += `"${colNamesExceptEmpty[cj]}":"${sheet.getCell(i, j).value}"`;
                    }
                }
                jsonString += '}';
                if (!skip) {
                    tabArray[ci++][0] = JSON.parse(jsonString);
                }
                else {
                    ci++;
                }
            }
        }
        // check if the array is empty， if no empty, then push the array to arrayExceptEmpty
        for (let i = 0; i < tabArray.length; i++) {
            if (tabArray[i][0] !== null) {
                let newArray = new Array();
                newArray.push(tabArray[i][0]);
                arrayExceptEmpty.push(newArray);
            }
        }
        return arrayExceptEmpty;
    }
    static async getWorkbook(file) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(file);
        return workbook;
    }
    static async getTableDataAsMap(file, tableName, sheetName) {
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
                    if (typeof colNames[cj] === 'string') {
                        colNames[cj] = colNames[cj].trim();
                    }
                }
            }
            else {
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
    static findCell(sheet, searchText, firstCol, firstRow) {
        const sheetRange = this.getSheetDimensions(sheet);
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
exports.ExcelUtil = ExcelUtil;
//# sourceMappingURL=excelUtil.js.map