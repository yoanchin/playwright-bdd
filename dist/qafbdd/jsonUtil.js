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
exports.JsonUtil = void 0;
const logger_1 = require("../utils/logger");
const fs = __importStar(require("fs"));
class JsonUtil {
    constructor() {
        this.logger = new logger_1.Logger({ verbose: true });
    }
    static toString(obj) {
        // Check if the object is a string or a number (primitive type)
        if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
            // Convert the object to its string representation
            return String(obj);
        }
        // Serialize the object to a JSON string
        return JSON.stringify(obj);
    }
    static toMap(json) {
        const correctedJson = json.replace(/'/g, '"');
        return JSON.parse(correctedJson);
    }
    static getJsonArrayOfMaps(jsonTable) {
        try {
            let mapData;
            if (jsonTable.startsWith("[")) {
                mapData = JSON.parse(jsonTable);
            }
            else {
                const jsonStr = fs.readFileSync(jsonTable, 'utf-8');
                mapData = JSON.parse(jsonStr);
            }
            const objectToReturn = new Array(mapData.length);
            for (let i = 0; i < mapData.length; i++) {
                objectToReturn[i] = [mapData[i]];
            }
            return objectToReturn;
        }
        catch (e) {
            throw new Error(`AutomationError: ${e.message}`);
        }
        return [];
    }
}
exports.JsonUtil = JsonUtil;
//# sourceMappingURL=jsonUtil.js.map