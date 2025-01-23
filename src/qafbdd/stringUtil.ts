import { Logger } from '../utils/logger';
export class StringUtil {
    private readonly logger: Logger = new Logger({ verbose: true });

    /**
	 * Method to parse character separated values, generic version of comma
	 * separated values Supports escape Character. It also supports quoted
	 * string.Examples:
	 * <ul>
	 * <li>"a",1,true,1.5 -> ["a",1,true,1.5]
	 * <li>"a,b",1,true,1.5 -> ["a,b",1,true,1.5]
	 * <li>" a ",1,true,1.5 -> [" a ",1,true,1.5]
	 * <li>,,, -> [null,null,null,null]
	 * <li>" a " , 1 , true , 1.5 ->[" a ",1,true,1.5]
	 * <li>a | 1 | true | 1.5 Separator |->["a",1,true,1.5]
	 * <li>" a "| 1 |true| 1.5 ->Separator |[" a ",1,true,1.5]
	 * <li>"a, b"| 1 |true| 1.5 ->Separator |["a, b",1,true,1.5]
	 * <li>a b | 1 |true| 1.5 ->Separator |["a b",1,true,1.5]
	 * <li>"a\" b" | 1 |true| 1.5 ->Separator |["a\" b",1,true,1.5]
	 * <li>| | | ->Separator |[null,null,null,null]
	 * <li>"a"" b" | 1 |true| 1.5 ->Separator |["a\" b",1,true,1.5]
	 * 
	 * 
	 * @param data
	 * @param char[] optional char args<br>
	 *               char[0] : Separator - default value ','<br>
	 *               char[1] : escape charter - default value '\'
	 * @return
	 */
    
    public static parseCSV(data: string, ...ch: (string | number)[]): any[] {
        let values: any[] = [];
        let hasSeperator = ch.length > 0 && ch[0] !== 0 && ch[0] !== ',';
        let seperator = hasSeperator ? ch[0] as string : ',';
        let escapeChar = ch.length >= 2 && ch[1] !== 0 ? ch[1] as string : '\\';
    
        if (data.indexOf(escapeChar + seperator) < 0) {
            if (hasSeperator && data.includes(',')) {
                data = this.ensureStringQuoted(data, seperator);
            }
            let commaSperatoredData:string ='';
            if(this.isSpecialChar(seperator)){
                commaSperatoredData = data.replace(new RegExp(`\\${seperator}`, 'g'), ',');
            }else{
                commaSperatoredData = data.replace(new RegExp(seperator, 'g'), ',');
            }
            
            if (commaSperatoredData.trim().endsWith(',')) {
                commaSperatoredData = commaSperatoredData + "\'\'";
            }
    
            return this.getArrayFromCsv(commaSperatoredData);
        } else {
            let sb = '';
    
            for (let i = 0; i < data.length; ++i) {
                let c = data.charAt(i);
                if (c === seperator) {
                    values.push(this.toObject(sb));
                    sb = '';
                } else {
                    if (c === escapeChar) {
                        ++i;
                        c = data.charAt(i);
                    }
    
                    sb += c;
                }
            }
    
            values.push(this.toObject(sb));
            return values;
        }
    }

    static toObject(value: string): any {
        let emptyString = '';
        // Dummy implementation of toObject, replace with actual logic
        if (value === '\'\'') {
            return emptyString;
        }
        return value;
    }
    
    static isBlank(str: string | Object): boolean {
        return str == null || str.toString().trim().length === 0;
    }
    
    static ensureStringQuoted(data: string, separator: string): string {
        if (this.isBlank(data) || data.indexOf(separator) < 0) {
            return data;
        }
        let sb: string = "";
        const parts: string[] = data.split(separator, -1);
        for (const part of parts) {
            let trimmedPart: string = part.trim();
            if (trimmedPart.indexOf(',') >= 0 && !trimmedPart.startsWith("\"") && !trimmedPart.endsWith("\"")) {
                trimmedPart = JSON.stringify(trimmedPart);
            }
            sb += trimmedPart + separator;
        }
        return sb.slice(0, -1);
    }
    
    static getArrayFromCsv(csv: string): any[] {
        // Simple CSV parsing
        const rows = csv.split('\n');
        const result: any[] = [];
    
        rows.forEach(row => {
            const values = row.split(',');
            const processedValues = values.map(value => this.toObject(value.trim()));
            result.push(...processedValues);
        });
    
        return result;
    }

    static isSpecialChar(char: string): boolean {
        let specialChars = '.|*+?()[]{}^$\\/';
        if (specialChars.includes(char)) {
            return true;
        } else {
            return false;
        }
    }

    static equalsIgnoreCase(str1: string, str2: string): boolean {
        return str1.toLowerCase() === str2.toLowerCase();
    }
}