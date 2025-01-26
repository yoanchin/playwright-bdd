import { defineConfig } from '@playwright/test';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';

export default defineConfig({
  timeout: 120_000,
  expect: { timeout: 10_000 },
  projects: [
    {
      name: 'pw-style',
      testDir: defineBddConfig({
        outputDir: '.features-gen/pw-style',
        paths: ['features'],
        steps: 'steps-pw-style/*.ts',
        verbose: true,
      }),
    }
  ],
  reporter: [cucumberReporter('html', { outputFile: 'actual-reports/report.html' })],
});
