import { GherkinDocumentUtil } from "./gherkinDocumentUtil";
import { Scenario } from "./scenario";
import Chance from 'chance';
import * as Types from '@cucumber/messages';
import { createHash } from 'crypto';

export class QafDocumentUtil {
    private static chance = new Chance();

    public static generateFixedNumbers(inputString: string, numDigits: number): number[] {
        // 使用SHA256哈希函数
        const hash = createHash('sha256');
        hash.update(inputString);
        const hexDig = hash.digest('hex');
    
        // 从哈希值中提取固定数量的数字
        const numbers: number[] = [];
        for (let i = 0; i < numDigits; i++) {
            // 取哈希值的第i个字符，并转换为数字
            const number = parseInt(hexDig[i], 16);
            numbers.push(number);
        }
        return numbers;
    }

    public static generateManyUniqueRandomIntegersWithChance(n: number): number[] {
        const uniqueNumbers = new Set<number>();
        let min: number = 1; let max: number = 1000000;
        while (uniqueNumbers.size < n) {
            const randomNumber = this.chance.integer({ min, max });
            uniqueNumbers.add(randomNumber);
        }
        return Array.from(uniqueNumbers);
    }

    public static generateManyUniqueRandomIntegersArrayWithChance(n: number,m: number): number[][] {
        let result:number[][] = [];
        for(let i = 0; i < n; i++){
            const uniqueNumbers = new Set<number>();
            let min: number = 1; let max: number = 1000000;
            while (uniqueNumbers.size < m) {
                const randomNumber = this.chance.integer({ min, max });
                uniqueNumbers.add(randomNumber);
            }
             result[i] = Array.from(uniqueNumbers);
        }
        return result;
    }

    public static generateOneUniqueRandomIntegersWithChance(): number {
        let min: number = 1; let max: number = 1000000;
        const randomNumber = this.chance.integer({ min, max });
        return randomNumber;
    }

    public static setTableBody(scenario:Scenario):Scenario{
        if(!scenario.getHasDP()){ //if no data provider, then no need to set table header
            return scenario;
        }
        let datafile:string = scenario.getMetadata()['datafile'];

        let object = scenario.getTestData()[0][0];
        let keys:string[] = Object.keys(object);
        let values: string[][] = [];
        for (let i = 0; i < scenario.getTestData().length; i++) {
            values[i] = [];
            for(let j = 0; j < keys.length; j++){
                values[i].push(scenario.getTestData()[i][0][keys[j]]);
            }
        }
        let body : Types.TableRow[] =  GherkinDocumentUtil.genTableBody(values,this.generateManyUniqueRandomIntegersArrayWithChance(values.length,keys.length),this.generateFixedNumbers(datafile,values.length));
        scenario.tableBody = body;
        return scenario;
    }

    public static setTableBodys(scenarios:Scenario[]):Scenario[]{
        scenarios.forEach(scenario => {
            this.setTableBody(scenario);
        });
        return scenarios;
    }

    public static setTableHeader(scenario:Scenario):Scenario{
        if(!scenario.getHasDP()){ //if no data provider, then no need to set table header
            return scenario;
        }
        let object = scenario.getTestData()[0][0];
        let keys:string[] = Object.keys(object);
        let header : Types.TableRow =  GherkinDocumentUtil.genTableHeader(keys,this.generateManyUniqueRandomIntegersWithChance(keys.length),this.generateOneUniqueRandomIntegersWithChance());
        scenario.tableHeader = header;
        return scenario;
    }

    public static setTableHeaders(scenarios:Scenario[]):Scenario[]{
        scenarios.forEach(scenario => {
            this.setTableHeader(scenario);
        });
        return scenarios;
    }

}