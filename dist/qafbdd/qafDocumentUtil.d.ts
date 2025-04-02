import { Scenario } from "./scenario";
export declare class QafDocumentUtil {
    private static chance;
    static generateFixedNumbers(inputString: string, numDigits: number): number[];
    static generateManyUniqueRandomIntegersWithChance(n: number): number[];
    static generateManyUniqueRandomIntegersArrayWithChance(n: number, m: number): number[][];
    static generateOneUniqueRandomIntegersWithChance(): number;
    static setTableBody(scenario: Scenario): Scenario;
    static setTableBodys(scenarios: Scenario[]): Scenario[];
    static setTableHeader(scenario: Scenario): Scenario;
    static setTableHeaders(scenarios: Scenario[]): Scenario[];
}
//# sourceMappingURL=qafDocumentUtil.d.ts.map