import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['src/cli/index.ts', 'src/gen/worker.ts', 'src/index.ts', 'src/decorators.ts'],
  project: ['src/**/*.ts'],
  ignore: ['**/*.d.ts'],
  ignoreDependencies: [
    '@cucumber/messages',
    '@cucumber/cucumber-expressions',
    '@cucumber/gherkin',
    'lint-staged',
    'np',
    'npm-run-all',
    'publint',
  ],
};

export default config;
