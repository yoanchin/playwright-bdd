import assert from "node:assert";
import { describe, it } from "node:test";
import { GherkinDocumentUtil } from "../../src/qafbdd/gherkinDocumentUtil";
import { IdGenerator } from '@cucumber/messages';
import * as Types from '@cucumber/messages/';
import { QafGherkinFactory } from "../../src/qafbdd/qafGherkinFactory";
import { GherkinFileParser } from "../../src/qafbdd/gherkinFileParser";
import path from "node:path";
import { QafDocument } from "../../src/qafbdd/qafDocument";
import { GherkinStreams, IGherkinStreamOptions } from "@cucumber/gherkin-streams";
import { LodashUtil } from "../../src/qafbdd/lodashUtil";
import { Readable } from "node:stream";
import _ from "lodash";

describe('Lodash Util', function() {
    it('should add table header into gherkin document', async function() {
    let gherkinFileParser: GherkinFileParser = QafGherkinFactory.getParser();
    let filePath = path.resolve(__dirname, 'resource/scenario-outline.feature');
    const featurePaths:string[] = [filePath];
    const options = {"relativeTo": path.resolve(__dirname)};
    let qafDocuments: QafDocument[] = await gherkinFileParser.qafGherkinFromPaths(featurePaths,options);
    assert.equal(qafDocuments.length, 1);
    assert.equal(qafDocuments[0].scenarios[0].getTestData().length, 2);
    assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["searchKey"], "QMetry QAF");
    assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["searchResult"], "QMetry Automation Framework");
    assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["number"], "10");
    assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["searchKey"], "Selenium ISFW");
    assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["searchResult"], "Infostretch Test Automation Framework");
    assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["number"], "20");
    const envelopes = await streamToArray(
      GherkinStreams.fromPaths(
        featurePaths,
        options
      )
    )
    assert.strictEqual(envelopes.length, 2)
    LodashUtil.setTable(envelopes[1],qafDocuments[0]);
    assert.equal(envelopes[1].gherkinDocument?.feature?.children?.length, 1);
    assert.equal(_.get(envelopes[1],'gherkinDocument.feature.children[0].scenario.examples[0].tableHeader.cells[0].value'),'searchKey');
    assert.equal(_.get(envelopes[1],'gherkinDocument.feature.children[0].scenario.examples[0].tableHeader.cells[1].value'),'searchResult');
    assert.equal(_.get(envelopes[1],'gherkinDocument.feature.children[0].scenario.examples[0].tableHeader.cells[2].value'),'number');
    });

    it('should add table bodys into gherkin document', async function() {
      let gherkinFileParser: GherkinFileParser = QafGherkinFactory.getParser();
      let filePath = path.resolve(__dirname, 'resource/scenario-outline.feature');
      const featurePaths:string[] = [filePath];
      const options = {"relativeTo": path.resolve(__dirname)};
      let qafDocuments: QafDocument[] = await gherkinFileParser.qafGherkinFromPaths(featurePaths,options);
      assert.equal(qafDocuments.length, 1);
      assert.equal(qafDocuments[0].scenarios[0].getTestData().length, 2);
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["searchKey"], "QMetry QAF");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["searchResult"], "QMetry Automation Framework");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["number"], "10");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["searchKey"], "Selenium ISFW");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["searchResult"], "Infostretch Test Automation Framework");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["number"], "20");
      const envelopes = await streamToArray(
        GherkinStreams.fromPaths(
          featurePaths,
          options
        )
      )
      assert.strictEqual(envelopes.length, 2)
      LodashUtil.setTable(envelopes[1],qafDocuments[0]);
      assert.equal(envelopes[1].gherkinDocument?.feature?.children?.length, 1);
      assert.equal(_.get(envelopes[1],'gherkinDocument.feature.children[0].scenario.examples[0].tableBody[0].cells[0].value'),'QMetry QAF');
      assert.equal(_.get(envelopes[1],'gherkinDocument.feature.children[0].scenario.examples[0].tableBody[0].cells[1].value'),'QMetry Automation Framework');
      assert.equal(_.get(envelopes[1],'gherkinDocument.feature.children[0].scenario.examples[0].tableBody[0].cells[2].value'),'10');
    });

    it('should replace statement param with value', async function() {
      let gherkinFileParser: GherkinFileParser = QafGherkinFactory.getParser();
      let filePath = path.resolve(__dirname, 'resource/scenario-outline.feature');
      const featurePaths:string[] = [filePath];
      const options = {"relativeTo": path.resolve(__dirname)};
      let qafDocuments: QafDocument[] = await gherkinFileParser.qafGherkinFromPaths(featurePaths,options);
      assert.equal(qafDocuments.length, 1);
      assert.equal(qafDocuments[0].scenarios[0].getTestData().length, 2);
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["searchKey"], "QMetry QAF");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["searchResult"], "QMetry Automation Framework");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["number"], "10");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["searchKey"], "Selenium ISFW");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["searchResult"], "Infostretch Test Automation Framework");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["number"], "20");
      let str: string = 'Then it should have "<searchResult>" in search results <number>';
      let str1 = LodashUtil.replaceParamWithValue(str,qafDocuments[0].scenarios[0].getTestData()[0]);
      assert.equal(str1.result, 'Then it should have "QMetry Automation Framework" in search results 10');
      assert.equal(str1.changed, true);
      let str2: string = 'Then it should have "<searchResult>" in search results';
      let str3 = LodashUtil.replaceParamWithValue(str2,qafDocuments[0].scenarios[0].getTestData()[0]);
      assert.equal(str3.result, 'Then it should have "QMetry Automation Framework" in search results');
      assert.equal(str3.changed, true);
    });

    it('should replace <> to blank', async function() {
      let statement: string = '<searchResult>';
      let statement1: string = LodashUtil.convertParam(statement);
      assert.equal(statement1, 'searchResult');

      let statement2: string = '<searchResult><searchResult><searchResult>';
      let statement3: string = LodashUtil.convertParam(statement2);
      assert.equal(statement3, 'searchResultsearchResultsearchResult');
    });

    it('should add gen corect pickls', async function() {
      let gherkinFileParser: GherkinFileParser = QafGherkinFactory.getParser();
      let filePath = path.resolve(__dirname, 'resource/scenario-outline.feature');
      const featurePaths:string[] = [filePath];
      const options = {"relativeTo": path.resolve(__dirname)};
      let qafDocuments: QafDocument[] = await gherkinFileParser.qafGherkinFromPaths(featurePaths,options);
      assert.equal(qafDocuments.length, 1);
      assert.equal(qafDocuments[0].scenarios[0].getTestData().length, 2);
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["searchKey"], "QMetry QAF");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["searchResult"], "QMetry Automation Framework");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["number"], "10");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["searchKey"], "Selenium ISFW");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["searchResult"], "Infostretch Test Automation Framework");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["number"], "20");
      const envelopes = await streamToArray(
        GherkinStreams.fromPaths(
          featurePaths,
          options
        )
      )
      assert.strictEqual(envelopes.length, 2)
      let pickls:Types.Pickle[] = LodashUtil.genTableAndPickles(envelopes[1],qafDocuments[0]);
      assert.equal(pickls.length, 2);
      assert.equal(pickls[0].steps.length, 3);
      assert.equal(pickls[1].steps.length, 3);
    });

    it('should add gen corect pickls with background', async function() {
      let gherkinFileParser: GherkinFileParser = QafGherkinFactory.getParser();
      let filePath = path.resolve(__dirname, 'resource/scenario-outline_background.feature');
      const featurePaths:string[] = [filePath];
      const options = {"relativeTo": path.resolve(__dirname)};
      let qafDocuments: QafDocument[] = await gherkinFileParser.qafGherkinFromPaths(featurePaths,options);
      assert.equal(qafDocuments.length, 1);
      assert.equal(qafDocuments[0].scenarios[0].getTestData().length, 3);
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["TDID"], "TDID1");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["searchKey"], "QMetry QAF4");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["searchResult"], "QMetry Automation Framework4");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["number"], "10");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["TDID"], "TDID2");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["searchKey"], "Selenium ISFW4");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["searchResult"], "Infostretch Test Automation Framework4");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["number"], "20");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[2][0]["TDID"], "TDID3");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[2][0]["searchKey"], "A4");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[2][0]["searchResult"], "B4");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[2][0]["number"], "30");
      const envelopes = await streamToArray(
        GherkinStreams.fromPaths(
          featurePaths,
          options
        )
      )
      assert.strictEqual(envelopes.length, 2)
      let pickls:Types.Pickle[] = LodashUtil.genTableAndPickles(envelopes[1],qafDocuments[0]);
      assert.equal(pickls.length, 3);
      assert.equal(pickls[0].steps.length, 6);
      assert.equal(pickls[1].steps.length, 6);
      assert.equal(pickls[2].steps.length, 6);
    });

    it('should add gen corect pickls with background by two steps', async function() {
      let gherkinFileParser: GherkinFileParser = QafGherkinFactory.getParser();
      let filePath = path.resolve(__dirname, 'resource/scenario-outline_background.feature');
      const featurePaths:string[] = [filePath];
      const options = {"relativeTo": path.resolve(__dirname)};
      let qafDocuments: QafDocument[] = await gherkinFileParser.qafGherkinFromPaths(featurePaths,options);
      assert.equal(qafDocuments.length, 1);
      assert.equal(qafDocuments[0].scenarios[0].getTestData().length, 3);
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["TDID"], "TDID1");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["searchKey"], "QMetry QAF4");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["searchResult"], "QMetry Automation Framework4");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["number"], "10");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["TDID"], "TDID2");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["searchKey"], "Selenium ISFW4");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["searchResult"], "Infostretch Test Automation Framework4");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["number"], "20");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[2][0]["TDID"], "TDID3");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[2][0]["searchKey"], "A4");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[2][0]["searchResult"], "B4");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[2][0]["number"], "30");
      const envelopes = await streamToArray(
        GherkinStreams.fromPaths(
          featurePaths,
          options
        )
      )
      assert.strictEqual(envelopes.length, 2)
      let enve:Types.Envelope = LodashUtil.setTable(envelopes[1],qafDocuments[0]);
      let pickls:Types.Pickle[] = LodashUtil.genPickles(enve,qafDocuments[0]);
      assert.equal(pickls.length, 3);
      assert.equal(pickls[0].steps.length, 6);
      assert.equal(pickls[1].steps.length, 6);
      assert.equal(pickls[2].steps.length, 6);
    });

    it('should add gen corect envs with background by two steps', async function() {
      let gherkinFileParser: GherkinFileParser = QafGherkinFactory.getParser();
      let filePath = path.resolve(__dirname, 'resource/scenario-outline_background.feature');
      const featurePaths:string[] = [filePath];
      const options = {"relativeTo": path.resolve(__dirname)};
      let qafDocuments: QafDocument[] = await gherkinFileParser.qafGherkinFromPaths(featurePaths,options);
      assert.equal(qafDocuments.length, 1);
      assert.equal(qafDocuments[0].scenarios[0].getTestData().length, 3);
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["TDID"], "TDID1");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["searchKey"], "QMetry QAF4");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["searchResult"], "QMetry Automation Framework4");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["number"], "10");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["TDID"], "TDID2");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["searchKey"], "Selenium ISFW4");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["searchResult"], "Infostretch Test Automation Framework4");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["number"], "20");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[2][0]["TDID"], "TDID3");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[2][0]["searchKey"], "A4");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[2][0]["searchResult"], "B4");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[2][0]["number"], "30");
      const envelopes = await streamToArray(
        GherkinStreams.fromPaths(
          featurePaths,
          options
        )
      )
      assert.strictEqual(envelopes.length, 2)
      let enve:Types.Envelope = LodashUtil.setTable(envelopes[1],qafDocuments[0]);
      let pickls:Types.Envelope[] = LodashUtil.genEnvelopesWithPickles(enve,qafDocuments[0]);
      assert.equal(pickls.length, 3);
      assert.equal(pickls[0].pickle?.steps.length, 6);
      assert.equal(pickls[1].pickle?.steps.length, 6);
      assert.equal(pickls[2].pickle?.steps.length, 6);
    });

    it('should add gen corect envs with background by two steps', async function() {
      let gherkinFileParser: GherkinFileParser = QafGherkinFactory.getParser();
      let filePath = path.resolve(__dirname, 'resource/scenario-outline-excel-sheetName-key.feature');
      const featurePaths:string[] = [filePath];
      const options = {"relativeTo": path.resolve(__dirname)};
      let qafDocuments: QafDocument[] = await gherkinFileParser.qafGherkinFromPaths(featurePaths,options);
      assert.equal(qafDocuments.length, 1);
      assert.equal(qafDocuments[0].scenarios[0].getTestData().length, 3);
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["start"], "2");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[0][0]["end"], "4");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["start"], "3");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[1][0]["end"], "6");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[2][0]["start"], "4");
      assert.equal(qafDocuments[0].scenarios[0].getTestData()[2][0]["end"], "8");
      const envelopes = await streamToArray(
        GherkinStreams.fromPaths(
          featurePaths,
          options
        )
      )
      assert.strictEqual(envelopes.length, 2)
      let enve:Types.Envelope = LodashUtil.setTable(envelopes[1],qafDocuments[0]);
      let pickls:Types.Envelope[] = LodashUtil.genEnvelopesWithPickles(enve,qafDocuments[0]);
      assert.equal(pickls.length, 3);
      assert.equal(pickls[0].pickle?.steps.length, 2);
      assert.equal(pickls[1].pickle?.steps.length, 2);
      assert.equal(pickls[2].pickle?.steps.length, 2);
    });
  });

// package util function
  async function streamToArray(
    readableStream: Readable
  ): Promise<Types.Envelope[]> {
    return new Promise<Types.Envelope[]>(
      (
        resolve: (wrappers: Types.Envelope[]) => void,
        reject: (err: Error) => void
      ) => {
        const items: Types.Envelope[] = []
        readableStream.on('data', items.push.bind(items))
        readableStream.on('error', (err: Error) => reject(err))
        readableStream.on('end', () => resolve(items))
      }
    )
  }