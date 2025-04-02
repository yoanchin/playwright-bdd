export declare class StringUtil {
    private readonly logger;
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
    static parseCSV(data: string, ...ch: (string | number)[]): any[];
    static toObject(value: string): any;
    static isBlank(str: string | Object): boolean;
    static ensureStringQuoted(data: string, separator: string): string;
    static getArrayFromCsv(csv: string): any[];
    static isSpecialChar(char: string): boolean;
    static equalsIgnoreCase(str1: string, str2: string): boolean;
}
//# sourceMappingURL=stringUtil.d.ts.map