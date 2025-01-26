import assert from "node:assert";
import { describe, it } from "node:test";
import { StringUtil } from "../../src/qafbdd/stringUtil";

describe('String Util File', function() {
    it('should get correct output of parseCSV method', function() {
        let csv:string = "| QMetry QAF | QMetry Automation Framework | 10 |";
        let out:string[] = StringUtil.parseCSV(csv,'|');
        assert.equal(out[0], "");
        assert.equal(out[1], "QMetry QAF");
        assert.equal(out[2], "QMetry Automation Framework");
        assert.equal(out[3], "10");
        assert.equal(out[4], "");
    });

    it('should get correct output of getArrayFromCsv method', function() {
      let csv:string = ", QMetry QAF , QMetry Automation Framework , 10 ,''";
      let out:string[] = StringUtil.getArrayFromCsv(csv);
      assert.equal(out[0], "");
      assert.equal(out[1], "QMetry QAF");
      assert.equal(out[2], "QMetry Automation Framework");
      assert.equal(out[3], "10");
      assert.equal(out[4], "");
    });

    it('should get correct output of toObject method', function() {
      let p1:string = "''";
      let p1_out:string[] = StringUtil.toObject(p1);
      assert.equal(p1_out, "");
      let p2:string = "10";
      let p2_out:string[] = StringUtil.toObject(p2);
      assert.equal(p2_out, "10");
    });

  });