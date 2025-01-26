import assert from "node:assert";
import { describe, it } from "node:test";
import { JsonUtil } from "../../src/qafbdd/jsonUtil";
import { any } from "micromatch";

class Person {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}

describe('Json Util File', function() {
    it('should get correct output of toString method', function() {
        let input:string = "Hello, World!";
        let output:string = JsonUtil.toString(input);
        assert.equal(output, "Hello, World!");

        let input1:number = 42;
        let output1:string = JsonUtil.toString(input1);
        assert.equal(output1, 42);

        let person:Person = new Person("John", 30);
        let output2:string = JsonUtil.toString(person);
        assert.equal(output2, '{"name":"John","age":30}');

        let input3:string[] = [];
        let output3:string = JsonUtil.toString(input3);
        assert.equal(output3, '[]');
    });

    it('should get correct output of toMap method', function() {
        let input:string = '{"a":"b"}';
        let output:Record<string,any> = JsonUtil.toMap(input);
        assert.equal(output.a, "b");

        let input1:string = "{'c':'d'}";
        let output1:Record<string,any> = JsonUtil.toMap(input1);
        assert.equal(output1.c, "d");

        Object.assign(output,output1);
        assert.equal(output.a, "b");
        assert.equal(output.c, "d");

        let input2:string = '{"groups":[]}';
        let output2:Record<string,any> = JsonUtil.toMap(input2);
        assert.equal(output2.groups.length, [].length);

        let input3:string = "{'datafile':'resources/testdata.txt'}";
        let output3:Record<string,any> = JsonUtil.toMap(input3);
        assert.equal(output3.datafile, "resources/testdata.txt");

        Object.assign(output2,output3);
        assert.equal(output2.groups.length, [].length);
        assert.equal(output3.datafile, "resources/testdata.txt");

        let input4:string = "{'datafile':'resources\\testdata.txt'}"; 
        let output4:Record<string,any> = JsonUtil.toMap(input4);
        assert.equal(output4.datafile, "resources\testdata.txt");
        
    });

  });