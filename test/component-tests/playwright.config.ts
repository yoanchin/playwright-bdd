import { defineConfig } from '@playwright/experimental-ct-react';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: './features',
  steps: 'steps/*.{js,jsx}',
});

export default defineConfig({
  testDir,
  timeout: 5 * 1000,
  use: {
    screenshot: 'only-on-failure',
  },
  reporter: [cucumberReporter('html', { outputFile: 'actual-reports/report.html' })],
});
