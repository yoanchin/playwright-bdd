import { StringUtil } from './stringUtil';
import { JsonUtil } from './jsonUtil';
import { DatabaseUtil } from './databaseUtil';
import { CVSUtil } from './cvsUtil';
import { ExcelUtil } from './excelUtil';
import { XmlUtil } from './xmlUtil';
import * as path from 'path';

enum ParamsEnum {
    datafile, sheetName, key, HASHEADERROW, sqlquery, BEANCLASS, /*JSON_DATA_TABLE*/ DATAPROVIDER, DATAPROVIDERCLASS, FILTER, FROM, TO, INDICES
    // ... other keys
}
export class MetaDataHelper {
    public static hasDP(metadata: { [key: string]: any }): boolean {
        if (!metadata) {
            return false;
        }
        const kv: { [key: string]: any } = {};
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

    public static async getData(metadata: { [key: string]: any }): Promise<any[][]> {

        const query = metadata['sqlquery'];
        if (!StringUtil.isBlank(query)) {
            return DatabaseUtil.getRecordDataAsMap(query);
        }
    
        const jsonTable = metadata['JSON_DATA_TABLE'];
        if (!StringUtil.isBlank(jsonTable)) {
            return JsonUtil.getJsonArrayOfMaps(jsonTable);
        }
    
        const file = metadata['datafile'];
        const key = metadata['key'];
    
        if (!StringUtil.isBlank(file)) {
            const rootDir = path.join(path.join(__dirname, '..'),'..');
            let filePath:string = path.resolve(rootDir, file);
            if (file.endsWith('json')) {
                return JsonUtil.getJsonArrayOfMaps(filePath);
            }
            if (file.endsWith('xml')) {
                const mapData = XmlUtil.getDataSetAsMap(key, filePath);
                return mapData as any[][];
            }
            if (file.endsWith('xlsx') || file.endsWith('xls')) {
                if (!StringUtil.isBlank(key)) {
                    return await ExcelUtil.getTableDataAsMap(filePath, key, metadata['sheetName']);
                }
                return await ExcelUtil.getExcelDataAsMap(filePath, metadata['sheetName']);
            }
            // csv, text
            const csvData = CVSUtil.getCSVDataAsMap(filePath);
            return csvData as any[][];
        }
        if (!StringUtil.isBlank(key)) {
            const mapData = XmlUtil.getDataSetAsMap(key, '');
            return mapData as any[][];
        }
        return [];
    }
    
    public static async getDataByCmd(metadata: { [key: string]: any }, cwd:string ): Promise<any[][]> {
        const query = metadata['sqlquery'];
        if (!StringUtil.isBlank(query)) {
            return DatabaseUtil.getRecordDataAsMap(query);
        }
    
        const jsonTable = metadata['JSON_DATA_TABLE'];
        if (!StringUtil.isBlank(jsonTable)) {
            return JsonUtil.getJsonArrayOfMaps(jsonTable);
        }
    
        const file = metadata['datafile'];
        const key = metadata['key'];
    
        if (!StringUtil.isBlank(file)) {
            // const rootDir = path.join(path.join(__dirname, '..'),'..');
            let filePath:string = path.resolve(cwd, file);
            if (file.endsWith('json')) {
                return JsonUtil.getJsonArrayOfMaps(filePath);
            }
            if (file.endsWith('xml')) {
                const mapData = XmlUtil.getDataSetAsMap(key, filePath);
                return mapData as any[][];
            }
            if (file.endsWith('xlsx') || file.endsWith('xls')) {
                if (!StringUtil.isBlank(key)) {
                    return await ExcelUtil.getTableDataAsMap(filePath, key, metadata['sheetName']);
                }
                return await ExcelUtil.getExcelDataAsMap(filePath, metadata['sheetName']);
            }
            // csv, text
            const csvData = CVSUtil.getCSVDataAsMap(filePath);
            return csvData as any[][];
        }
        if (!StringUtil.isBlank(key)) {
            const mapData = XmlUtil.getDataSetAsMap(key, '');
            return mapData as any[][];
        }
        return [];
    }
}