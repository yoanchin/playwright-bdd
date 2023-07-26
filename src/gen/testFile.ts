/**
 * Generate test code.
 */

/* eslint-disable max-lines, max-params */

import {
  GherkinDocument,
  FeatureChild,
  RuleChild,
  Scenario,
  Background,
  Step,
  PickleStep,
  Pickle,
  Feature,
  Rule,
  Examples,
  TableRow,
} from '@cucumber/messages';
import fs from 'node:fs';
import path from 'node:path';
import * as formatter from './formatter';
import { KeywordsMap, getKeywordsMap } from './i18n';
import { ISupportCodeLibrary } from '@cucumber/cucumber/lib/support_code_library_builder/types';
import { findStepDefinition } from '../cucumber/loadSteps';
import { extractFixtureNames } from '../stepDefinitions/createBdd';
import { TEST_KEY_SEPARATOR, TestFileTags, getFormatterFlags } from './tags';
import { BDDConfig } from '../config';
import { KeywordType, getStepKeywordType } from '@cucumber/cucumber/lib/formatter/helpers/index';
import { exitWithMessage, template } from '../utils';
import { CucumberStepFunction, PomNode } from '../stepDefinitions/defineStep';
import { POMS, buildFixtureTag } from './poms';

type TestFileOptions = {
  doc: GherkinDocument;
  pickles: Pickle[];
  supportCodeLibrary: ISupportCodeLibrary;
  outputPath: string;
  config: BDDConfig;
};

// Decorator steps handled after all steps to resolve fixtures correctly
type PreparedDecoratorStep = {
  index: number;
  keyword: string;
  pickleStep: PickleStep;
  pomNode: PomNode;
};

export type UndefinedStep = {
  keywordType: KeywordType;
  step: Step;
  pickleStep: PickleStep;
};

export class TestFile {
  private lines: string[] = [];
  private keywordsMap?: KeywordsMap;
  private testFileTags = new TestFileTags();
  public hasCustomTest = false;
  public undefinedSteps: UndefinedStep[] = [];

  constructor(private options: TestFileOptions) {}

  get sourceFile() {
    const { uri } = this.options.doc;
    if (!uri) throw new Error(`Document without uri`);
    return uri;
  }

  get content() {
    return this.lines.join('\n');
  }

  get language() {
    return this.options.doc.feature?.language || 'en';
  }

  get config() {
    return this.options.config;
  }

  get outputPath() {
    return this.options.outputPath;
  }

  build() {
    this.loadI18nKeywords();
    this.lines = [
      ...this.getFileHeader(), // prettier-ignore
      ...this.getRootSuite(),
      ...this.getUseFixtures(),
    ];
    return this;
  }

  save() {
    const dir = path.dirname(this.outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(this.outputPath, this.content);
  }

  private getFileHeader() {
    const importTestFrom = this.getRelativeImportTestFrom();
    return formatter.fileHeader(this.sourceFile, importTestFrom);
  }

  private loadI18nKeywords() {
    if (this.language !== 'en') {
      this.keywordsMap = getKeywordsMap(this.language);
    }
  }

  private getRelativeImportTestFrom() {
    const { importTestFrom } = this.config;
    if (!importTestFrom) return;
    const { file, varName } = importTestFrom;
    const dir = path.dirname(this.outputPath);
    return {
      file: path.relative(dir, file),
      varName,
    };
  }

  private getUseFixtures() {
    return formatter.useFixtures([
      ...formatter.testFixture(),
      ...formatter.tagsFixture(this.testFileTags.tagsMap, TEST_KEY_SEPARATOR),
    ]);
  }

  private getRootSuite() {
    const { feature } = this.options.doc;
    if (!feature) throw new Error(`Document without feature.`);
    return this.getSuite(feature);
  }

  /**
   * Generate test.describe suite for root Feature or Rule
   */
  private getSuite(feature: Feature | Rule, parents: (Feature | Rule)[] = []) {
    const flags = getFormatterFlags(feature);
    const lines: string[] = [];
    const newParents = [...parents, feature];
    feature.children.forEach((child) => lines.push(...this.getSuiteChild(child, newParents)));
    return formatter.suite(feature.name, lines, flags);
  }

  private getSuiteChild(child: FeatureChild | RuleChild, parents: (Feature | Rule)[]) {
    if ('rule' in child && child.rule) return this.getSuite(child.rule, parents);
    if (child.background) return this.getBeforeEach(child.background);
    if (child.scenario) return this.getScenarioLines(child.scenario, parents);
    throw new Error(`Empty child: ${JSON.stringify(child)}`);
  }

  private getScenarioLines(scenario: Scenario, parents: (Feature | Rule)[]) {
    return isOutline(scenario)
      ? this.getOutlineSuite(scenario, parents)
      : this.getTest(scenario, parents);
  }

  /**
   * Generate test.beforeEach for Background
   */
  private getBeforeEach(bg: Background) {
    const { fixtures, lines } = this.getSteps(bg);
    return formatter.beforeEach(fixtures, lines);
  }

  /**
   * Generate test.describe suite for Scenario Outline
   */
  private getOutlineSuite(scenario: Scenario, parents: (Feature | Rule)[]) {
    const lines: string[] = [];
    const flags = getFormatterFlags(scenario);
    const newParents = [...parents, scenario];
    let exampleIndex = 0;
    scenario.examples.forEach((examples) => {
      const titleFormat = this.getExamplesTitleFormat(examples);
      examples.tableBody.forEach((exampleRow) => {
        const testTitle = this.getOutlineTestTitle(
          titleFormat,
          examples,
          exampleRow,
          ++exampleIndex,
        );
        const testLines = this.getOutlineTest(
          scenario,
          examples,
          exampleRow,
          testTitle,
          newParents,
        );
        lines.push(...testLines);
      });
    });
    return formatter.suite(scenario.name, lines, flags);
  }

  /**
   * Generate test from Examples row
   */
  // eslint-disable-next-line max-params
  private getOutlineTest(
    scenario: Scenario,
    examples: Examples,
    exampleRow: TableRow,
    title: string,
    parents: (Feature | Rule | Scenario)[],
  ) {
    const flags = getFormatterFlags(examples);
    const testTags = this.testFileTags.registerTestTags(parents, title, examples.tags);
    const { fixtures, lines } = this.getSteps(scenario, testTags, exampleRow.id);
    return formatter.test(title, fixtures, lines, flags);
  }

  /**
   * Generate test from Scenario
   */
  private getTest(scenario: Scenario, parents: (Feature | Rule)[]) {
    const testTags = this.testFileTags.registerTestTags(parents, scenario.name, scenario.tags);
    const flags = getFormatterFlags(scenario);
    const { fixtures, lines } = this.getSteps(scenario, testTags);
    return formatter.test(scenario.name, fixtures, lines, flags);
  }

  /**
   * Generate test steps
   */
  private getSteps(
    scenario: Scenario | Background,
    testTags?: string[],
    outlineExampleRowId?: string,
  ) {
    const testFixtureNames = new Set<string>();
    const usedPoms = new POMS();
    const decoratorSteps: PreparedDecoratorStep[] = [];
    let previousKeywordType: KeywordType | undefined = undefined;

    const lines = scenario.steps.map((step, index) => {
      const {
        keyword,
        keywordType,
        fixtureNames: stepFixtureNames,
        line,
        pickleStep,
        stepConfig,
      } = this.getStep(step, previousKeywordType, outlineExampleRowId);
      previousKeywordType = keywordType;
      testFixtureNames.add(keyword);
      stepFixtureNames.forEach((fixtureName) => testFixtureNames.add(fixtureName));

      if (!line && stepConfig?.pomNode) {
        usedPoms.add(stepConfig.pomNode);
        decoratorSteps.push({ index, keyword, pickleStep, pomNode: stepConfig.pomNode });
      }

      return line;
    });

    if (decoratorSteps.length) {
      testFixtureNames.forEach((fixtureName) => usedPoms.addByFixtureName(fixtureName));
      testTags?.forEach((tag) => usedPoms.addByTag(tag));
      decoratorSteps.forEach((step) => {
        const { line, fixtureNames } = this.getDecoratorStep(step, usedPoms);
        lines[step.index] = line;
        fixtureNames.forEach((fixtureName) => testFixtureNames.add(fixtureName));
      });
    }

    return { fixtures: testFixtureNames, lines };
  }

  /**
   * Generate step for Given, When, Then
   */
  private getStep(
    step: Step,
    previousKeywordType: KeywordType | undefined,
    outlineExampleRowId?: string,
  ) {
    const pickleStep = this.getPickleStep(step, outlineExampleRowId);
    const stepDefinition = findStepDefinition(
      this.options.supportCodeLibrary,
      pickleStep.text,
      this.sourceFile,
    );
    const keywordType = getStepKeywordType({
      keyword: step.keyword,
      language: this.language,
      previousKeywordType,
    });
    const keyword = this.getKeyword(step);
    if (!stepDefinition) {
      this.undefinedSteps.push({ keywordType, step, pickleStep });
      return this.getMissingStep(keyword, keywordType, pickleStep);
    }
    // for cucumber-style stepConfig is undefined
    const { stepConfig } = stepDefinition.code as CucumberStepFunction;
    if (stepConfig?.hasCustomTest) this.hasCustomTest = true;
    const fixtureNames = stepConfig?.isDecorator ? [] : extractFixtureNames(stepConfig?.fn);
    const line = stepConfig?.isDecorator
      ? ''
      : formatter.step(keyword, pickleStep.text, pickleStep.argument, fixtureNames);
    return {
      keyword,
      keywordType,
      fixtureNames,
      line,
      pickleStep,
      stepConfig,
    };
  }

  private getMissingStep(keyword: string, keywordType: KeywordType, pickleStep: PickleStep) {
    return {
      keyword,
      keywordType,
      fixtureNames: [],
      line: formatter.missingStep(keyword, pickleStep.text),
      pickleStep,
      stepConfig: undefined,
    };
  }

  private getPickleStep(step: Step, outlineExampleRowId?: string) {
    for (const pickle of this.options.pickles) {
      const pickleStep = pickle.steps.find(({ astNodeIds }) => {
        const hasStepId = astNodeIds.includes(step.id);
        const hasRowId = !outlineExampleRowId || astNodeIds.includes(outlineExampleRowId);
        return hasStepId && hasRowId;
      });
      if (pickleStep) return pickleStep;
    }

    throw new Error(`Pickle step not found for step: ${step.text}`);
  }

  private getKeyword(step: Step) {
    const origKeyword = step.keyword.trim();
    if (origKeyword === '*') return 'And';
    if (!this.keywordsMap) return origKeyword;
    const enKeyword = this.keywordsMap.get(origKeyword);
    if (!enKeyword) throw new Error(`Keyword not found: ${origKeyword}`);
    return enKeyword;
  }

  private getDecoratorStep(step: PreparedDecoratorStep, usedPoms: POMS) {
    const { keyword, pickleStep, pomNode } = step;
    const fixtureNames = usedPoms.resolveFixtureNames(pomNode);

    if (fixtureNames.length !== 1) {
      const suggestedTags = fixtureNames.map((name) => buildFixtureTag(name)).join(', ');
      exitWithMessage(
        `Can't guess fixture for decorator step "${pickleStep.text}" in file: ${this.sourceFile}.`,
        `Please set one of the following tags (${suggestedTags}) or refactor your Page Object classes.`,
      );
    }

    return {
      fixtureNames,
      line: formatter.step(keyword, pickleStep.text, pickleStep.argument, [fixtureNames[0]]),
    };
  }

  private getOutlineTestTitle(
    titleFormat: string,
    examples: Examples,
    exampleRow: TableRow,
    exampleIndex: number,
  ) {
    const params: Record<string, unknown> = {
      _index_: exampleIndex,
    };

    exampleRow.cells.forEach((cell, index) => {
      const colName = examples.tableHeader?.cells[index]?.value;
      if (colName) params[colName] = cell.value;
    });

    return template(titleFormat, params);
  }

  private getExamplesTitleFormat(examples: Examples) {
    const { line } = examples.location;
    const titleFormatCommentLine = line - 1;
    const comment = this.options.doc.comments.find((c) => {
      return c.location.line === titleFormatCommentLine;
    });
    const commentText = comment?.text?.trim();
    const prefix = '# title-format:';
    return commentText?.startsWith(prefix)
      ? commentText.replace(prefix, '').trim()
      : this.config.examplesTitleFormat;
  }
}

function isOutline(scenario: Scenario) {
  return scenario.keyword === 'Scenario Outline' || scenario.keyword === 'Scenario Template';
}
