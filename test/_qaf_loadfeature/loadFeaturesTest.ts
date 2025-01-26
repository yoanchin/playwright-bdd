import assert from "node:assert";
import { describe, it } from "node:test";
import { QafGherkinFactory } from "../../src/qafbdd/qafGherkinFactory";
import { GherkinFileParser } from "../../src/qafbdd/gherkinFileParser";
import path from "node:path";
import { FeaturesLoader } from "../../src/features/load";
import _ from "lodash";
describe('load Features', function() {
    it('should load gherkin document and pickles for excel sheetName and key', async function(){
        let filePath = path.resolve(__dirname, 'resource/scenario-outline-excel-sheetName-key.feature');
        const featurePaths:string[] = [filePath];
        const options = {"relativeTo": path.resolve(__dirname)};
        let featuresLoader:FeaturesLoader = new FeaturesLoader();
        await featuresLoader.load(featurePaths, options);
        assert.equal(featuresLoader.getDocumentsCount(), 1);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles.length,3);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].feature?.children[0].scenario?.examples[0].tableBody.length,3);

    });

    it('should load gherkin document and pickles for excel sheetName', async function() {
        let filePath = path.resolve(__dirname, 'resource/scenario-outline-excel-sheetName.feature');
        const featurePaths:string[] = [filePath];
        const options = {"relativeTo": path.resolve(__dirname)};
        let featuresLoader:FeaturesLoader = new FeaturesLoader();
        await featuresLoader.load(featurePaths, options);
        assert.equal(featuresLoader.getDocumentsCount(), 1);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles.length,3);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].feature?.children[0].scenario?.examples[0].tableBody.length,3);

    });

    it('should load gherkin document and pickles for home page', async function() {
        let filePath = path.resolve(__dirname, 'resource/homepage.feature');
        const featurePaths:string[] = [filePath];
        const options = {"relativeTo": path.resolve(__dirname)};
        let featuresLoader:FeaturesLoader = new FeaturesLoader();
        await featuresLoader.load(featurePaths, options);
        assert.equal(featuresLoader.getDocumentsCount(), 1);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles.length,2);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].feature?.children[0].scenario?.examples[0].tableBody.length,2);

    });

    it('should load gherkin document and pickles for data table of step', async function() {
        let filePath = path.resolve(__dirname, 'resource/scenario-outline-datatable.feature');
        const featurePaths:string[] = [filePath];
        const options = {"relativeTo": path.resolve(__dirname)};
        let featuresLoader:FeaturesLoader = new FeaturesLoader();
        await featuresLoader.load(featurePaths, options);
        assert.equal(featuresLoader.getDocumentsCount(), 1);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles.length,3);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].feature?.children[0].scenario?.examples[0].tableBody.length,3);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].feature?.children[0].scenario?.steps[2].dataTable?.rows.length,4);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[2].argument?.dataTable?.rows.length,4);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[1].steps[2].argument?.dataTable?.rows.length,4);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[2].steps[2].argument?.dataTable?.rows.length,4);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[2].argument?.dataTable?.rows[0].cells.length,5);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[2].argument?.dataTable?.rows[1].cells.length,5);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[2].argument?.dataTable?.rows[2].cells.length,5);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[2].argument?.dataTable?.rows[3].cells.length,5);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[2].argument?.dataTable?.rows[0].cells[0].value  ,"row1_value1");
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[2].argument?.dataTable?.rows[0].cells[1].value  ,"row1_value2");
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[2].argument?.dataTable?.rows[0].cells[4].value  ,"row1_value5");
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[2].argument?.dataTable?.rows[2].cells[4].value  ,"row3_value5");
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[2].argument?.dataTable?.rows[3].cells[4].value  ,"row4_value5");
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[2].argument?.dataTable?.rows[3].cells[1].value  ,"row4_value2");
        assert.ok(_.has(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[2],'argument'));
        assert.ok(!_.has(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[0],'argument'));
        assert.ifError(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[0].argument);
        assert.ifError(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[1].argument);
    });

    it('should load gherkin document with background and pickles for data table of step', async function() {
        let filePath = path.resolve(__dirname, 'resource/scenario-outline-datatable-background.feature');
        const featurePaths:string[] = [filePath];
        const options = {"relativeTo": path.resolve(__dirname)};
        let featuresLoader:FeaturesLoader = new FeaturesLoader();
        await featuresLoader.load(featurePaths, options);
        assert.equal(featuresLoader.getDocumentsCount(), 1);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles.length,3);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].feature?.children[1].scenario?.examples[0].tableBody.length,3);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].feature?.children[0].background?.steps[1].dataTable?.rows.length,2);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].feature?.children[0].background?.steps[2].dataTable?.rows.length,2);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].feature?.children[1].scenario?.steps[2].dataTable?.rows.length,2);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].feature?.children[1].scenario?.steps[3].dataTable?.rows.length,2);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[1].argument?.dataTable?.rows.length,2);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[2].argument?.dataTable?.rows.length,2);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[5].argument?.dataTable?.rows.length,2);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[6].argument?.dataTable?.rows.length,2);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[1].steps[2].argument?.dataTable?.rows.length,2);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[2].steps[2].argument?.dataTable?.rows.length,2);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[2].argument?.dataTable?.rows[0].cells.length,5);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[2].argument?.dataTable?.rows[1].cells.length,5);
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[2].argument?.dataTable?.rows[0].cells[0].value  ,"brow3_value1");
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[2].argument?.dataTable?.rows[0].cells[1].value  ,"brow3_value2");
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[6].argument?.dataTable?.rows[0].cells[0].value  ,"row3_value1");
        assert.equal(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[6].argument?.dataTable?.rows[0].cells[1].value  ,"row3_value2");
        assert.ok(_.has(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[2],'argument'));
        assert.ok(!_.has(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[0],'argument'));
        assert.ifError(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[0].argument);
        assert.ifError(featuresLoader.getDocumentsWithPickles()[0].pickles[0].steps[3].argument);
    });

  });