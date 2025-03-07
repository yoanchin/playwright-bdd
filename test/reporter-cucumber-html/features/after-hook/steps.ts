import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';
import { expect } from '@playwright/test';

const { Given, After } = createBdd(test);

// 'page' arg is important to have a screenshot in the report
After({ tags: '@failing-anonymous-after-hook' }, async ({ page }) => {
  await expect(page).toHaveTitle('foo');
});

After({ name: 'failing named after hook', tags: '@failing-named-after-hook' }, async ({ page }) => {
  await expect(page).toHaveTitle('foo');
});

After({ name: 'failing named after hook2', tags: '@failing-named-after-hook2' }, async () => {
  expect(true).toBe(false);
});

After({ tags: '@failing-after-hook-with-step' }, async ({ page, $test }) => {
  await $test.step('my step', async () => {
    await expect(page).toHaveTitle('foo');
  });
});

After({ name: 'my timeouted hook', tags: '@after-hook-with-timeout' }, async ({ $testInfo }) => {
  await new Promise((r) => setTimeout(r, $testInfo.timeout + 100));
});

Given('step that uses fixtureWithErrorInTeardown', async ({ fixtureWithErrorInTeardown }) => {
  return fixtureWithErrorInTeardown;
});

Given(
  'step that uses fixtureWithErrorInTeardownStep',
  async ({ fixtureWithErrorInTeardownStep }) => {
    return fixtureWithErrorInTeardownStep;
  },
);

Given('step that uses fixtureWithTimeoutInTeardown', async ({ fixtureWithTimeoutInTeardown }) => {
  return fixtureWithTimeoutInTeardown;
});
