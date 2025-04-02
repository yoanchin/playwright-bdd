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
exports.MetaDataHelper = void 0;
const stringUtil_1 = require("./stringUtil");
const jsonUtil_1 = require("./jsonUtil");
const databaseUtil_1 = require("./databaseUtil");
const cvsUtil_1 = require("./cvsUtil");
const excelUtil_1 = require("./excelUtil");
const xmlUtil_1 = require("./xmlUtil");
const path = __importStar(require("path"));
var ParamsEnum;
(function (ParamsEnum) {
    ParamsEnum[ParamsEnum["datafile"] = 0] = "datafile";
    ParamsEnum[ParamsEnum["sheetName"] = 1] = "sheetName";
    ParamsEnum[ParamsEnum["key"] = 2] = "key";
    ParamsEnum[ParamsEnum["HASHEADERROW"] = 3] = "HASHEADERROW";
    ParamsEnum[ParamsEnum["sqlquery"] = 4] = "sqlquery";
    ParamsEnum[ParamsEnum["BEANCLASS"] = 5] = "BEANCLASS";
    ParamsEnum[ParamsEnum["DATAPROVIDER"] = 6] = "DATAPROVIDER";
    ParamsEnum[ParamsEnum["DATAPROVIDERCLASS"] = 7] = "DATAPROVIDERCLASS";
    ParamsEnum[ParamsEnum["FILTER"] = 8] = "FILTER";
    ParamsEnum[ParamsEnum["FROM"] = 9] = "FROM";
    ParamsEnum[ParamsEnum["TO"] = 10] = "TO";
    ParamsEnum[ParamsEnum["INDICES"] = 11] = "INDICES";
    // ... other keys
})(ParamsEnum || (ParamsEnum = {}));
class MetaDataHelper {
    static hasDP(metadata) {
        if (!metadata) {
            return false;
        }
        const kv = {};
        for (const key in metadata) {
            if (metadata.hasOwnProperty(key)) {
                kv[key.toLowerCase()] = metadata[key];
            }
        }
        for (const key in ParamsEnum) {
            if (ParamsEnum.hasOwnProperty(key)) {
                if (kv.hasOwnProperty(key.toLowerCase())) {
                    return true;
                }
            }
        }
        return false;
    }
    static async getData(metadata) {
        const query = metadata['sqlquery'];
        if (!stringUtil_1.StringUtil.isBlank(query)) {
            return databaseUtil_1.DatabaseUtil.getRecordDataAsMap(query);
        }
        const jsonTable = metadata['JSON_DATA_TABLE'];
        if (!stringUtil_1.StringUtil.isBlank(jsonTable)) {
            return jsonUtil_1.JsonUtil.getJsonArrayOfMaps(jsonTable);
        }
        const file = metadata['datafile'];
        const key = metadata['key'];
        if (!stringUtil_1.StringUtil.isBlank(file)) {
            const rootDir = path.join(path.join(__dirname, '..'), '..');
            let filePath = path.resolve(rootDir, file);
            if (file.endsWith('json')) {
                return jsonUtil_1.JsonUtil.getJsonArrayOfMaps(filePath);
            }
            if (file.endsWith('xml')) {
                const mapData = xmlUtil_1.XmlUtil.getDataSetAsMap(key, filePath);
                return mapData;
            }
            if (file.endsWith('xlsx') || file.endsWith('xls')) {
                if (!stringUtil_1.StringUtil.isBlank(key)) {
                    return await excelUtil_1.ExcelUtil.getTableDataAsMap(filePath, key, metadata['sheetName']);
                }
                return await excelUtil_1.ExcelUtil.getExcelDataAsMap(filePath, metadata['sheetName']);
            }
            // csv, text
            const csvData = cvsUtil_1.CVSUtil.getCSVDataAsMap(filePath);
            return csvData;
        }
        if (!stringUtil_1.StringUtil.isBlank(key)) {
            const mapData = xmlUtil_1.XmlUtil.getDataSetAsMap(key, '');
            return mapData;
        }
        return [];
    }
    static async getDataByCmd(metadata, cwd) {
        const query = metadata['sqlquery'];
        if (!stringUtil_1.StringUtil.isBlank(query)) {
            return databaseUtil_1.DatabaseUtil.getRecordDataAsMap(query);
        }
        const jsonTable = metadata['JSON_DATA_TABLE'];
        if (!stringUtil_1.StringUtil.isBlank(jsonTable)) {
            return jsonUtil_1.JsonUtil.getJsonArrayOfMaps(jsonTable);
        }
        const file = metadata['datafile'];
        const key = metadata['key'];
        if (!stringUtil_1.StringUtil.isBlank(file)) {
            // const rootDir = path.join(path.join(__dirname, '..'),'..');
            let filePath = path.resolve(cwd, file);
            if (file.endsWith('json')) {
                return jsonUtil_1.JsonUtil.getJsonArrayOfMaps(filePath);
            }
            if (file.endsWith('xml')) {
                const mapData = xmlUtil_1.XmlUtil.getDataSetAsMap(key, filePath);
                return mapData;
            }
            if (file.endsWith('xlsx') || file.endsWith('xls')) {
                if (!stringUtil_1.StringUtil.isBlank(key)) {
                    return await excelUtil_1.ExcelUtil.getTableDataAsMap(filePath, key, metadata['sheetName']);
                }
                return await excelUtil_1.ExcelUtil.getExcelDataAsMap(filePath, metadata['sheetName']);
            }
            // csv, text
            const csvData = cvsUtil_1.CVSUtil.getCSVDataAsMap(filePath);
            return csvData;
        }
        if (!stringUtil_1.StringUtil.isBlank(key)) {
            const mapData = xmlUtil_1.XmlUtil.getDataSetAsMap(key, '');
            return mapData;
        }
        return [];
    }
}
exports.MetaDataHelper = MetaDataHelper;
//# sourceMappingURL=metaDataHelper.js.map