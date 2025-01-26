import assert from "node:assert";
import { describe, it } from "node:test";
import { GherkinFileParser } from "../../src/qafbdd/gherkinFileParser";
import * as path from 'path';
import { QafDocument } from "../../src/qafbdd/qafDocument";
import { QafGherkinFactory } from "../../src/qafbdd/qafGherkinFactory";
describe('Parse Qaf Gherkin File to Qaf Gherkin Document', function () {
  it('should get correct qaf document', async function () {
    let gherkinFileParser: GherkinFileParser = QafGherkinFactory.getParser();
    let filePath = path.resolve(__dirname, 'resource/scenario-outline-examples-excel-sheet.feature');
    let filePath1 = path.resolve(__dirname, 'resource/scenario-outline-examples-excel-sheet-key.feature');
    const featurePaths:string[] = [filePath,filePath1];
    const options = {"relativeTo": path.resolve(__dirname)};
    let qafDocuments: QafDocument[] = await gherkinFileParser.qafGherkinFromPaths(featurePaths,options);
    assert.equal(qafDocuments.length, 2);
    assert.equal(qafDocuments[0].scenarios[0].getTestData().length, 2);
    assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["searchKey"], "QMetry QAF");
    assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["searchResult"], "QMetry Automation Framework");
    assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["number"], "10");
    assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["searchKey"], "Selenium ISFW");
    assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["searchResult"], "Infostretch Test Automation Framework");
    assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["number"], "20");

    assert.equal(qafDocuments[1].scenarios[0].getTestData().length, 2);
    assert.equal(qafDocuments[1].scenarios[0].getTestData()[0][0]["searchKey"], "QMetry QAF");
    assert.equal(qafDocuments[1].scenarios[0].getTestData()[0][0]["searchResult"], "QMetry Automation Framework");
    assert.equal(qafDocuments[1].scenarios[0].getTestData()[0][0]["number"], "10");
    assert.equal(qafDocuments[1].scenarios[0].getTestData()[1][0]["searchKey"], "Selenium ISFW");
    assert.equal(qafDocuments[1].scenarios[0].getTestData()[1][0]["searchResult"], "Infostretch Test Automation Framework");
    assert.equal(qafDocuments[1].scenarios[0].getTestData()[1][0]["number"], "20");
  });
  
});