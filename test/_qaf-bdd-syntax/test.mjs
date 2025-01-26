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

test(`${testDir.name} (cucumber-style)`, () => {
  execPlaywrightTest(testDir.name, `${DEFAULT_CMD} --project=cucumber-style`);
  checkResults('.features-gen/cucumber-style/features');
});

function checkResults(outDir) {
  checkImportTestPath(outDir);
}

function checkImportTestPath(outDir) {
  testDir.expectFileContains(`${outDir}/scenario-outline-excel-json-background.feature.spec.js`, [
    outDir.includes('cucumber-style')
      ? 'import { test } from "../../../steps-cucumber-style/fixtures.ts";'
      : 'import { test } from "../../../steps-pw-style/fixtures.ts";',
  ]);
  testDir.expectFileContains(`${outDir}/scenario-outline-excel-sheetName-key.feature.spec.js`, [
    outDir.includes('cucumber-style')
      ? 'import { test } from "../../../steps-cucumber-style/fixtures.ts";'
      : 'import { test } from "../../../steps-pw-style/fixtures.ts";',
  ]);
  testDir.expectFileContains(`${outDir}/scenario-outline-excel-sheetName.feature.spec.js`, [
    outDir.includes('cucumber-style')
      ? 'import { test } from "../../../steps-cucumber-style/fixtures.ts";'
      : 'import { test } from "../../../steps-pw-style/fixtures.ts";',
  ]);
  testDir.expectFileContains(`${outDir}/scenario-outline-json-file.feature.spec.js`, [
    outDir.includes('cucumber-style')
      ? 'import { test } from "../../../steps-cucumber-style/fixtures.ts";'
      : 'import { test } from "../../../steps-pw-style/fixtures.ts";',
  ]);
}
