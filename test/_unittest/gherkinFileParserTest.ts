import assert from "node:assert";
import { describe, it } from "node:test";
import { GherkinFileParser } from "../../src/qafbdd/gherkinFileParser";
import * as path from 'path';
import { Scenario } from "../../src/qafbdd/scenario";
describe('Parse Qaf Gherkin Feature File', function () {
  it('should get correct output of feature file', async function () {
    let gherkinFileParser: GherkinFileParser = new GherkinFileParser();
    let filePath = path.resolve(__dirname, 'resource/scenario-outline.feature');
    let feature = await gherkinFileParser.parseFile(filePath);
    assert.equal(feature[0][0], "Scenario");
    assert.equal(feature[0][1], " Search InfoStrech with results");
    assert.equal(feature[0][2], '{"groups":[]}');
    assert.equal(feature[0][3], '1');
    assert.equal(feature[1][0], 'When I search for "QAFWebElement"');
    assert.equal(feature[1][1], "");
    assert.equal(feature[1][2], '');
    assert.equal(feature[1][3], '2');
    assert.equal(feature[2][0], 'Then it should have following search results:["QMetry Automation Framework","Custom & component"]');
    assert.equal(feature[2][1], "");
    assert.equal(feature[2][2], '');
    assert.equal(feature[2][3], '3');

    let scenarios: Scenario[] = await gherkinFileParser.parse(filePath);
    assert.equal(scenarios.length, 1);
    assert.equal(scenarios[0].getScenarioName(), 'Search InfoStrech with results');
    assert.equal(scenarios[0].getHasDP(), false);
    assert.equal(scenarios[0].getSteps().length, 2);
    assert.equal(scenarios[0].getSteps()[0].getName(), 'When I search for "QAFWebElement"');
    assert.equal(scenarios[0].getSteps()[1].getName(), 'Then it should have following search results:["QMetry Automation Framework","Custom & component"]');
    assert.equal(scenarios[0].getMetadata()['groups'], 0);
    assert.equal(scenarios[0].getMetadata()['reference'], path.relative('./',filePath));
    assert.equal(scenarios[0].getMetadata()['lineNo'], 1);
  });

  it('should get correct data table  of feature file', async function () {
    let gherkinFileParser: GherkinFileParser = new GherkinFileParser();
    let filePath = path.resolve(__dirname, 'resource/scenario-outline-examples.feature');
    let feature = await gherkinFileParser.parseFile(filePath);
    assert.equal(feature[0][0], "SCENARIO");
    assert.equal(feature[0][1], " Search Keyword");
    assert.equal(feature[0][2], '{"groups":[],"JSON_DATA_TABLE":"[{\\"searchKey\\":\\"QMetry QAF\\",\\"searchResult\\":\\"QMetry Automation Framework\\",\\"number\\":\\"10\\"},{\\"searchKey\\":\\"Selenium ISFW\\",\\"searchResult\\":\\"Infostretch Test Automation Framework\\",\\"number\\":\\"20\\"}]"}');
    assert.equal(feature[0][3], '1');
    assert.equal(feature[1][0], 'When I search for "${searchKey}"');
    assert.equal(feature[1][1], "");
    assert.equal(feature[1][2], '');
    assert.equal(feature[1][3], '2');
    assert.equal(feature[2][0], 'Then I get at least ${number} results');
    assert.equal(feature[2][1], "");
    assert.equal(feature[2][2], '');
    assert.equal(feature[2][3], '3');
    assert.equal(feature[3][0], 'Then it should have "${searchResult}" in search results');
    assert.equal(feature[3][1], "");
    assert.equal(feature[3][2], '');
    assert.equal(feature[3][3], '4');
    assert.equal(feature[4][0], 'END');
    assert.equal(feature[4][1], "");
    assert.equal(feature[4][2], '');
    assert.equal(feature[4][3], '10');

    let scenarios: Scenario[] = await gherkinFileParser.parse(filePath);
    assert.equal(scenarios.length, 1);
    assert.equal(scenarios[0].getScenarioName(), 'Search Keyword');
    assert.equal(scenarios[0].getHasDP(), false);
    assert.equal(scenarios[0].getSteps().length, 3);
    assert.equal(scenarios[0].getSteps()[0].getName(), 'When I search for "${searchKey}"');
    assert.equal(scenarios[0].getSteps()[1].getName(), 'Then I get at least ${number} results');
    assert.equal(scenarios[0].getSteps()[2].getName(), 'Then it should have "${searchResult}" in search results');
    assert.equal(scenarios[0].getMetadata()['groups'], 0);
    assert.equal(scenarios[0].getMetadata()['JSON_DATA_TABLE'], '[{"searchKey":"QMetry QAF","searchResult":"QMetry Automation Framework","number":"10"},{"searchKey":"Selenium ISFW","searchResult":"Infostretch Test Automation Framework","number":"20"}]');
    assert.equal(scenarios[0].getMetadata()['reference'], path.relative('./',filePath));
    assert.equal(scenarios[0].getMetadata()['lineNo'], 1);
  });

  it('should get correct txt datafile  of feature file', async function () {
    let gherkinFileParser: GherkinFileParser = new GherkinFileParser();
    let filePath = path.resolve(__dirname, 'resource/scenario-outline-examples-file.feature');
    let feature = await gherkinFileParser.parseFile(filePath);
    assert.equal(feature[0][0], "SCENARIO");
    assert.equal(feature[0][1], " Search Keyword using data from file");
    assert.equal(feature[0][2], '{"groups":[],"datafile":"resources/testdata.txt"}');
    assert.equal(feature[0][3], '1');
    assert.equal(feature[1][0], 'When I search for "${searchKey}"');
    assert.equal(feature[1][1], "");
    assert.equal(feature[1][2], '');
    assert.equal(feature[1][3], '2');
    assert.equal(feature[2][0], 'Then I get at least ${number} results');
    assert.equal(feature[2][1], "");
    assert.equal(feature[2][2], '');
    assert.equal(feature[2][3], '3');
    assert.equal(feature[3][0], 'Then it should have "${searchResult}" in search results');
    assert.equal(feature[3][1], "");
    assert.equal(feature[3][2], '');
    assert.equal(feature[3][3], '4');
    assert.equal(feature[4][0], 'END');
    assert.equal(feature[4][1], "");
    assert.equal(feature[4][2], '');
    assert.equal(feature[4][3], '7');

    let scenarios: Scenario[] = await gherkinFileParser.parse(filePath);
    assert.equal(scenarios.length, 1);
    assert.equal(scenarios[0].getScenarioName(), 'Search Keyword using data from file');
    assert.equal(scenarios[0].getHasDP(), true);
    assert.equal(scenarios[0].getSteps().length, 3);
    assert.equal(scenarios[0].getSteps()[0].getName(), 'When I search for "${searchKey}"');
    assert.equal(scenarios[0].getSteps()[1].getName(), 'Then I get at least ${number} results');
    assert.equal(scenarios[0].getSteps()[2].getName(), 'Then it should have "${searchResult}" in search results');
    assert.equal(scenarios[0].getMetadata()['groups'], 0);
    assert.equal(scenarios[0].getMetadata()['datafile'], 'resources/testdata.txt');
    assert.equal(scenarios[0].getMetadata()['reference'], path.relative('./',filePath));
    assert.equal(scenarios[0].getMetadata()['lineNo'], 1);

  });

  it('should get correct excel datafile with sheename and key of feature file', async function () {
    let gherkinFileParser: GherkinFileParser = new GherkinFileParser();
    let filePath = path.resolve(__dirname, 'resource/scenario-outline-examples-excelfile.feature');
    let feature = await gherkinFileParser.parseFile(filePath);
    assert.equal(feature[0][0], "SCENARIO");
    assert.equal(feature[0][1], " Search Keyword using data from file");
    assert.equal(feature[0][2], '{"groups":[],"datafile":"resources/testdata.xls","sheetName":"B1","key":"propose"}');
    assert.equal(feature[0][3], '1');
    assert.equal(feature[1][0], 'When I search for "${searchKey}"');
    assert.equal(feature[1][1], "");
    assert.equal(feature[1][2], '');
    assert.equal(feature[1][3], '2');
    assert.equal(feature[2][0], 'Then I get at least ${number} results');
    assert.equal(feature[2][1], "");
    assert.equal(feature[2][2], '');
    assert.equal(feature[2][3], '3');
    assert.equal(feature[3][0], 'Then it should have "${searchResult}" in search results');
    assert.equal(feature[3][1], "");
    assert.equal(feature[3][2], '');
    assert.equal(feature[3][3], '4');
    assert.equal(feature[4][0], 'END');
    assert.equal(feature[4][1], "");
    assert.equal(feature[4][2], '');
    assert.equal(feature[4][3], '7');

    let scenarios: Scenario[] = await gherkinFileParser.parse(filePath);
    assert.equal(scenarios.length, 1);
    assert.equal(scenarios[0].getScenarioName(), 'Search Keyword using data from file');
    assert.equal(scenarios[0].getHasDP(), true);
    assert.equal(scenarios[0].getSteps().length, 3);
    assert.equal(scenarios[0].getSteps()[0].getName(), 'When I search for "${searchKey}"');
    assert.equal(scenarios[0].getSteps()[1].getName(), 'Then I get at least ${number} results');
    assert.equal(scenarios[0].getSteps()[2].getName(), 'Then it should have "${searchResult}" in search results');
    assert.equal(scenarios[0].getMetadata()['groups'], 0);
    assert.equal(scenarios[0].getMetadata()['datafile'], 'resources/testdata.xls');
    assert.equal(scenarios[0].getMetadata()['sheetName'], 'B1');
    assert.equal(scenarios[0].getMetadata()['key'], 'propose');
    assert.equal(scenarios[0].getMetadata()['reference'], path.relative('./',filePath));
    assert.equal(scenarios[0].getMetadata()['lineNo'], 1);
  });

  it('should get correct feature tag and excel datafile with sheename and key of feature file', async function () {
    let gherkinFileParser: GherkinFileParser = new GherkinFileParser();
    let filePath = path.resolve(__dirname, 'resource/scenario-outline-feature-examples-excelfile.feature');
    let feature = await gherkinFileParser.parseFile(filePath);
    assert.equal(feature[0][0], "Feature");
    assert.equal(feature[0][1], " Google Search");
    assert.equal(feature[0][2], '{"groups":["@spacex_test1"]}');
    assert.equal(feature[0][3], '2');
    assert.equal(feature[1][0], "SCENARIO");
    assert.equal(feature[1][1], " Search Keyword using data from file");
    assert.equal(feature[1][2], '{"groups":["@spacex_test1_datadriver","@spacex_test1"],"datafile":"resources/testdata.xls","sheetName":"B1","key":"propose"}');
    assert.equal(feature[1][3], '5');
    assert.equal(feature[2][0], 'When I search for "${searchKey}"');
    assert.equal(feature[2][1], "");
    assert.equal(feature[2][2], '');
    assert.equal(feature[2][3], '6');
    assert.equal(feature[3][0], 'Then I get at least ${number} results');
    assert.equal(feature[3][1], "");
    assert.equal(feature[3][2], '');
    assert.equal(feature[3][3], '7');
    assert.equal(feature[4][0], 'Then it should have "${searchResult}" in search results');
    assert.equal(feature[4][1], "");
    assert.equal(feature[4][2], '');
    assert.equal(feature[4][3], '8');
    assert.equal(feature[5][0], 'END');
    assert.equal(feature[5][1], "");
    assert.equal(feature[5][2], '');
    assert.equal(feature[5][3], '11');

    let scenarios: Scenario[] = await gherkinFileParser.parse(filePath);
    assert.equal(scenarios.length, 1);
    assert.equal(scenarios[0].getScenarioName(), 'Search Keyword using data from file');
    assert.equal(scenarios[0].getHasDP(), true);
    assert.equal(scenarios[0].getSteps().length, 3);
    assert.equal(scenarios[0].getSteps()[0].getName(), 'When I search for "${searchKey}"');
    assert.equal(scenarios[0].getSteps()[1].getName(), 'Then I get at least ${number} results');
    assert.equal(scenarios[0].getSteps()[2].getName(), 'Then it should have "${searchResult}" in search results');
    assert.equal(scenarios[0].getMetadata()['groups'].length, 2);
    assert.equal(scenarios[0].getMetadata()['datafile'], 'resources/testdata.xls');
    assert.equal(scenarios[0].getMetadata()['sheetName'], 'B1');
    assert.equal(scenarios[0].getMetadata()['key'], 'propose');
    assert.equal(scenarios[0].getMetadata()['reference'], path.relative('./',filePath));
    assert.equal(scenarios[0].getMetadata()['lineNo'], 5);
  });

  it('should get correct background feature tag and excel datafile with sheename and key of feature file of multiple scenarios', async function () {
    let gherkinFileParser: GherkinFileParser = new GherkinFileParser();
    let filePath = path.resolve(__dirname, 'resource/scenario-outline-all.feature');
    let scenarios: Scenario[] = await gherkinFileParser.parse(filePath);
    assert.equal(scenarios.length, 4);
    assert.equal(scenarios[0].getScenarioName(), 'Search InfoStrech');
    assert.equal(scenarios[0].getHasDP(), false);
    assert.equal(scenarios[0].getSteps().length, 6);
    assert.equal(scenarios[0].getSteps()[0].getName(), 'Given I am on Google Search Page');
    assert.equal(scenarios[0].getSteps()[1].getName(), 'And I have valid search keyword');
    assert.equal(scenarios[0].getSteps()[2].getName(), "And I set testCaseId as '<TDID>'");
    assert.equal(scenarios[0].getSteps()[3].getName(), "When I search for 'git qmetry'");
    assert.equal(scenarios[0].getSteps()[4].getName(), "Then I get at least 5 results");
    assert.equal(scenarios[0].getSteps()[5].getName(), "And it should have 'QMetry Automation Framework' in search results");
    assert.equal(scenarios[0].getMetadata()['groups'].length, 2);
    assert.equal(scenarios[0].getMetadata()['reference'], path.relative('./',filePath));
    assert.equal(scenarios[0].getMetadata()['lineNo'], 10);

    assert.equal(scenarios[1].getScenarioName(), 'Search InfoStrech with results');
    assert.equal(scenarios[1].getHasDP(), false);
    assert.equal(scenarios[1].getSteps().length, 5);
    assert.equal(scenarios[1].getSteps()[0].getName(), 'Given I am on Google Search Page');
    assert.equal(scenarios[1].getSteps()[1].getName(), 'And I have valid search keyword');
    assert.equal(scenarios[1].getSteps()[2].getName(), "And I set testCaseId as '<TDID>'");
    assert.equal(scenarios[1].getSteps()[3].getName(), "When I search for 'QAFWebElement'");
    assert.equal(scenarios[1].getSteps()[4].getName(), 'Then it should have following search results:["QMetry Automation Framework","Custom & component"]');
    assert.equal(scenarios[1].getMetadata()['groups'].length, 2);
    assert.equal(scenarios[1].getMetadata()['reference'], path.relative('./',filePath));
    assert.equal(scenarios[1].getMetadata()['lineNo'], 16);

    assert.equal(scenarios[2].getScenarioName(), 'Search Keyword');
    assert.equal(scenarios[2].getHasDP(), false);
    assert.equal(scenarios[2].getSteps().length, 6);
    assert.equal(scenarios[2].getSteps()[0].getName(), 'Given I am on Google Search Page');
    assert.equal(scenarios[2].getSteps()[1].getName(), 'And I have valid search keyword');
    assert.equal(scenarios[2].getSteps()[2].getName(), "And I set testCaseId as '<TDID>'");
    assert.equal(scenarios[2].getSteps()[3].getName(), "When I search for '${searchKey}'");
    assert.equal(scenarios[2].getSteps()[4].getName(), "Then I get at least ${number} results");
    assert.equal(scenarios[2].getSteps()[5].getName(), "Then it should have '${searchResult}' in search results");
    assert.equal(scenarios[2].getMetadata()['groups'].length, 2);
    assert.equal(scenarios[2].getMetadata()['reference'], path.relative('./',filePath));
    assert.equal(scenarios[2].getMetadata()['JSON_DATA_TABLE'], '[{"searchKey":"QMetry QAF","searchResult":"QMetry Automation Framework","number":"10"},{"searchKey":"Selenium ISFW","searchResult":"Infostretch Test Automation Framework","number":"20"}]');
    assert.equal(scenarios[2].getMetadata()['lineNo'], 23);

    assert.equal(scenarios[3].getScenarioName(), 'Search Keyword using data from file');
    assert.equal(scenarios[3].getHasDP(), true);
    assert.equal(scenarios[3].getSteps().length, 6);
    assert.equal(scenarios[3].getSteps()[0].getName(), 'Given I am on Google Search Page');
    assert.equal(scenarios[3].getSteps()[1].getName(), 'And I have valid search keyword');
    assert.equal(scenarios[3].getSteps()[2].getName(), "And I set testCaseId as '<TDID>'");
    assert.equal(scenarios[3].getSteps()[3].getName(), "When I search for '${searchKey}'");
    assert.equal(scenarios[3].getSteps()[4].getName(), 'Then I get at least ${number} results');
    assert.equal(scenarios[3].getSteps()[5].getName(), "Then it should have '${searchResult}' in search results");
    assert.equal(scenarios[3].getMetadata()['groups'].length, 2);
    assert.equal(scenarios[3].getMetadata()['reference'], path.relative('./',filePath));
    assert.equal(scenarios[3].getMetadata()['datafile'], 'resources/testdata.txt');
    assert.equal(scenarios[3].getMetadata()['lineNo'], 34);
  });
  
  it('should get correct feature tag and excel datafile with sheename and key of feature file of multiple scenarios', async function () {
    let gherkinFileParser: GherkinFileParser = new GherkinFileParser();
    let filePath = path.resolve(__dirname, 'resource/multiple-scenario-outline-feature-examples-excelfile.feature');
    let scenarios: Scenario[] = await gherkinFileParser.parse(filePath);
    assert.equal(scenarios.length, 4);
    assert.equal(scenarios[0].getScenarioName(), 'Search Keyword using data from file');
    assert.equal(scenarios[0].getHasDP(), true);
    assert.equal(scenarios[0].getSteps().length, 3);
    assert.equal(scenarios[0].getSteps()[0].getName(), 'When I search for "${searchKey}"');
    assert.equal(scenarios[0].getSteps()[1].getName(), 'Then I get at least ${number} results');
    assert.equal(scenarios[0].getSteps()[2].getName(), 'Then it should have "${searchResult}" in search results');
    assert.equal(scenarios[0].getMetadata()['groups'].length, 2);
    assert.equal(scenarios[0].getMetadata()['datafile'], 'resources/testdata.xls');
    assert.equal(scenarios[0].getMetadata()['sheetName'], 'B1');
    assert.equal(scenarios[0].getMetadata()['key'], 'propose');
    assert.equal(scenarios[0].getMetadata()['reference'], path.relative('./',filePath));
    assert.equal(scenarios[0].getMetadata()['lineNo'], 5);

    assert.equal(scenarios[1].getScenarioName(), 'Search Keyword using data from file2');
    assert.equal(scenarios[1].getHasDP(), true);
    assert.equal(scenarios[1].getSteps().length, 3);
    assert.equal(scenarios[1].getSteps()[0].getName(), 'When I search2 for "${searchKey}"');
    assert.equal(scenarios[1].getSteps()[1].getName(), 'Then I get2 at least ${number} results');
    assert.equal(scenarios[1].getSteps()[2].getName(), 'Then it should2 have "${searchResult}" in search results');
    assert.equal(scenarios[1].getMetadata()['groups'].length, 2);
    assert.equal(scenarios[1].getMetadata()['datafile'], 'resources/testdata2.xls');
    assert.equal(scenarios[1].getMetadata()['sheetName'], 'B2');
    assert.equal(scenarios[1].getMetadata()['key'], 'propose2');
    assert.equal(scenarios[1].getMetadata()['reference'], path.relative('./',filePath));
    assert.equal(scenarios[1].getMetadata()['lineNo'], 13);

    assert.equal(scenarios[2].getScenarioName(), 'Search Keyword using data from file3');
    assert.equal(scenarios[2].getHasDP(), true);
    assert.equal(scenarios[2].getSteps().length, 3);
    assert.equal(scenarios[2].getSteps()[0].getName(), 'When I search3 for "${searchKey}"');
    assert.equal(scenarios[2].getSteps()[1].getName(), 'Then I get3 at least ${number} results');
    assert.equal(scenarios[2].getSteps()[2].getName(), 'Then it should3 have "${searchResult}" in search results');
    assert.equal(scenarios[2].getMetadata()['groups'].length, 2);
    assert.equal(scenarios[2].getMetadata()['datafile'], 'resources/testdata3.xls');
    assert.equal(scenarios[2].getMetadata()['sheetName'], 'B3');
    assert.equal(scenarios[2].getMetadata()['key'], 'propose3');
    assert.equal(scenarios[2].getMetadata()['reference'], path.relative('./',filePath));
    assert.equal(scenarios[2].getMetadata()['lineNo'], 21);

    assert.equal(scenarios[3].getScenarioName(), 'Search Keyword using data from file4');
    assert.equal(scenarios[3].getHasDP(), true);
    assert.equal(scenarios[3].getSteps().length, 3);
    assert.equal(scenarios[3].getSteps()[0].getName(), 'When I search4 for "${searchKey}"');
    assert.equal(scenarios[3].getSteps()[1].getName(), 'Then I get4 at least ${number} results');
    assert.equal(scenarios[3].getSteps()[2].getName(), 'Then it should4 have "${searchResult}" in search results');
    assert.equal(scenarios[3].getMetadata()['groups'].length, 2);
    assert.equal(scenarios[3].getMetadata()['datafile'], 'resources/testdata4.json');
    assert.equal(scenarios[3].getMetadata()['reference'], path.relative('./',filePath));
    assert.equal(scenarios[3].getMetadata()['lineNo'], 29);
  });

  it('should get correct json data table and set to scennario', async function () {
    let gherkinFileParser: GherkinFileParser = new GherkinFileParser();
    let filePath = path.resolve(__dirname, 'resource/scenario-outline-examples.feature');

    let scenarios: Scenario[] = await gherkinFileParser.parseAndsetTestData(filePath);
    assert.equal(scenarios.length, 1);
    assert.equal(scenarios[0].getTestData().length, 2);
    assert.equal(scenarios[0].getTestData()[0][0]["searchKey"], "QMetry QAF");
    assert.equal(scenarios[0].getTestData()[0][0]["searchResult"], "QMetry Automation Framework");
    assert.equal(scenarios[0].getTestData()[0][0]["number"], "10");
    assert.equal(scenarios[0].getTestData()[1][0]["searchKey"], "Selenium ISFW");
    assert.equal(scenarios[0].getTestData()[1][0]["searchResult"], "Infostretch Test Automation Framework");
    assert.equal(scenarios[0].getTestData()[1][0]["number"], "20");
  });

  it('should get correct json data table and set to scennario', async function () {
    let gherkinFileParser: GherkinFileParser = new GherkinFileParser();
    let filePath = path.resolve(__dirname, 'resource/scenario-outline-examples.feature');

    let scenarios: Scenario[] = await gherkinFileParser.parseAndsetTestData(filePath);
    assert.equal(scenarios.length, 1);
    assert.equal(scenarios[0].getTestData().length, 2);
    assert.equal(scenarios[0].getTestData()[0][0]["searchKey"], "QMetry QAF");
    assert.equal(scenarios[0].getTestData()[0][0]["searchResult"], "QMetry Automation Framework");
    assert.equal(scenarios[0].getTestData()[0][0]["number"], "10");
    assert.equal(scenarios[0].getTestData()[1][0]["searchKey"], "Selenium ISFW");
    assert.equal(scenarios[0].getTestData()[1][0]["searchResult"], "Infostretch Test Automation Framework");
    assert.equal(scenarios[0].getTestData()[1][0]["number"], "20");
  });


  it('should get correct json data file and set to scennario', async function () {
    let gherkinFileParser: GherkinFileParser = new GherkinFileParser();
    let filePath = path.resolve(__dirname, 'resource/scenario-outline-examples-jsonfile.feature');

    let scenarios: Scenario[] = await gherkinFileParser.parseAndsetTestData(filePath);
    assert.equal(scenarios.length, 1);
    assert.equal(scenarios[0].getTestData().length, 2);
    assert.equal(scenarios[0].getTestData()[0][0]["searchKey"], "QMetry QAF");
    assert.equal(scenarios[0].getTestData()[0][0]["searchResult"], "QMetry Automation Framework");
    assert.equal(scenarios[0].getTestData()[0][0]["number"], "10");
    assert.equal(scenarios[0].getTestData()[1][0]["searchKey"], "Selenium ISFW");
    assert.equal(scenarios[0].getTestData()[1][0]["searchResult"], "Infostretch Test Automation Framework");
    assert.equal(scenarios[0].getTestData()[1][0]["number"], "20");
  });

  it('should get correct excle data file by sheetname and key and set to scennario', async function () {
    let gherkinFileParser: GherkinFileParser = new GherkinFileParser();
    let filePath = path.resolve(__dirname, 'resource/scenario-outline-examples-excel-sheet-key.feature');

    let scenarios: Scenario[] = await gherkinFileParser.parseAndsetTestData(filePath);
    assert.equal(scenarios.length, 1);
    assert.equal(scenarios[0].getTestData().length, 2);
    assert.equal(scenarios[0].getTestData()[0][0]["searchKey"], "QMetry QAF");
    assert.equal(scenarios[0].getTestData()[0][0]["searchResult"], "QMetry Automation Framework");
    assert.equal(scenarios[0].getTestData()[0][0]["number"], "10");
    assert.equal(scenarios[0].getTestData()[1][0]["searchKey"], "Selenium ISFW");
    assert.equal(scenarios[0].getTestData()[1][0]["searchResult"], "Infostretch Test Automation Framework");
    assert.equal(scenarios[0].getTestData()[1][0]["number"], "20");
  });

  it('should get correct excle data file by sheetname and set to scennario', async function () {
    let gherkinFileParser: GherkinFileParser = new GherkinFileParser();
    let filePath = path.resolve(__dirname, 'resource/scenario-outline-examples-excel-sheet.feature');

    let scenarios: Scenario[] = await gherkinFileParser.parseAndsetTestData(filePath);
    assert.equal(scenarios.length, 1);
    assert.equal(scenarios[0].getTestData().length, 2);
    assert.equal(scenarios[0].getTestData()[0][0]["searchKey"], "QMetry QAF");
    assert.equal(scenarios[0].getTestData()[0][0]["searchResult"], "QMetry Automation Framework");
    assert.equal(scenarios[0].getTestData()[0][0]["number"], "10");
    assert.equal(scenarios[0].getTestData()[1][0]["searchKey"], "Selenium ISFW");
    assert.equal(scenarios[0].getTestData()[1][0]["searchResult"], "Infostretch Test Automation Framework");
    assert.equal(scenarios[0].getTestData()[1][0]["number"], "20");

    let object = scenarios[0].getTestData()[0][0];
    let keys = Object.keys(object);
    assert.equal(keys.length, 3);
    assert.equal(keys[0], "searchKey");
    assert.equal(keys[1], "searchResult");
    assert.equal(keys[2], "number");
  });
  
  
  
});