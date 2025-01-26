import assert from "node:assert";
import { describe, it } from "node:test";
import { QafDocumentUtil } from "../../src/qafbdd/qafDocumentUtil";

describe('qafDocument Util', function() {
    it('generateFixedNumbers get same data number array', function() {
        let ids: number[] = QafDocumentUtil.generateFixedNumbers("testdata/testdata1.json",4);
        let ids1: number[] = QafDocumentUtil.generateFixedNumbers("testdata/testdata1.json",4);
        let ids2: number[] = QafDocumentUtil.generateFixedNumbers("testdata/testdata1.json",4);
        let ids3: number[] = QafDocumentUtil.generateFixedNumbers("testdata/testdata1.json",4);
        assert.deepStrictEqual(ids, ids1,"arrays should be equal");
        assert.deepStrictEqual(ids, ids2,"arrays should be equal");
        assert.deepStrictEqual(ids, ids3,"arrays should be equal");
    });
  });