import { Logger } from '../utils/logger';
import * as fs from 'fs';
export class JsonUtil {
    private readonly logger: Logger = new Logger({ verbose: true });

    public static toString(obj: any): string {
        // Check if the object is a string or a number (primitive type)
        if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
            // Convert the object to its string representation
            return String(obj);
        }
    
        // Serialize the object to a JSON string
        return JSON.stringify(obj);
    }
    
    public static toMap(json: string): any {
        const correctedJson = json.replace(/'/g, '"');
        return JSON.parse(correctedJson);
    }

    public static getJsonArrayOfMaps(jsonTable: string): any[][] {
        try {
            let mapData: Array<{ [key: string]: any }[]>;
    
            if (jsonTable.startsWith("[")) {
                mapData = JSON.parse(jsonTable);
            } else {
                const jsonStr = fs.readFileSync(jsonTable, 'utf-8');
                mapData = JSON.parse(jsonStr);
            }
    
            const objectToReturn: any[][] = new Array(mapData.length);
            for (let i = 0; i < mapData.length; i++) {
                objectToReturn[i] = [mapData[i]];
            }
            return objectToReturn;
        } catch (e) {
            throw new Error(`AutomationError: ${e.message}`);
        }
        return [];
    }
    
}