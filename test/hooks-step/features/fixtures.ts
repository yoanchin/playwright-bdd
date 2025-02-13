import timers from 'node:timers/promises';
import { createBdd } from 'playwright-bdd';
import { testWithLog } from '../../_helpers/withLog';

type TestFixtures = {
  testFixtureCommon: void;
  testFixtureScenario2: void;
};

export const test = testWithLog.extend<TestFixtures>({
  testFixtureCommon: async ({ log }, use) => {
    log(`testFixtureCommon setup`);
    await use();
  },

  // this fixture is used only by step hooks tagged with @scenario2
  testFixtureScenario2: async ({ log }, use) => {
    // tiny delay to always setup this fixture after testFixtureCommon
    await timers.setTimeout(50);
    log(`testFixtureScenario2 setup`);
    await use();
  },
});

export const { Given, BeforeStep, AfterStep } = createBdd(test);
