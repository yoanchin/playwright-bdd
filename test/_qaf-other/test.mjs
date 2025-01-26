import {
  test,
  TestDir,
  execPlaywrightTest,
  playwrightVersion,
  DEFAULT_CMD,
} from '../_helpers/index.mjs';

const testDir = new TestDir(import.meta);

test(`${testDir.name} (playwright-style)`, () => {
  execPlaywrightTest(testDir.name, `${DEFAULT_CMD} --project=pw-style`);
  checkResults('.features-gen/pw-style/features');
});

function checkResults(outDir) {
  checkImportTestPath(outDir);
}

function checkImportTestPath(outDir) {
  testDir.expectFileContains(`${outDir}/homepage.feature.spec.js`, [
    'import { test } from "../../../steps-cucumber-style/fixtures.ts";',
  ]);
  testDir.expectFileContains(`${outDir}/scenario-outline-datatable-background.feature.spec.js`, [
    'import { test } from "../../../steps-cucumber-style/fixtures.ts";',
  ]);
}

