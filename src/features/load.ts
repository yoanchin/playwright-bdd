/**
 * Load features.
 *
 * See: https://github.com/cucumber/cucumber-js/blob/main/src/api/load_sources.ts
 * See: https://github.com/cucumber/cucumber-js/blob/main/src/api/gherkin.ts
 */

import { GherkinStreams, IGherkinStreamOptions } from '@cucumber/gherkin-streams';
import { Query as GherkinQuery } from '@cucumber/gherkin-utils';
import { Envelope, ParseError, Pickle, GherkinDocument, Location } from '@cucumber/messages';
import { resolveFiles } from '../utils/paths';
import { toArray } from '../utils';
import { Readable } from 'node:stream';
import { QafDocument } from '../qafbdd/qafDocument';
import { LodashUtil } from '../qafbdd/lodashUtil';
import { QafGherkinFactory } from '../qafbdd/qafGherkinFactory';
import { GherkinFileParser } from '../qafbdd/gherkinFileParser';
import { Logger } from '../utils/logger';
let logger: Logger = new Logger({ verbose: false });
export type GherkinDocumentWithPickles = GherkinDocument & {
  pickles: PickleWithLocation[];
};

export type PickleWithLocation = Pickle & {
  location: Location;
};

export function resolveFeatureFiles(cwd: string, patterns: string | string[]) {
  return resolveFiles(cwd, toArray(patterns), 'feature');
}

export class FeaturesLoader {
  gherkinQuery = new GherkinQuery();
  parseErrors: ParseError[] = [];

  /**
   * Loads and parses feature files.
   * - featureFiles should be absolute.
   *   See: https://github.com/cucumber/gherkin-streams/blob/main/src/GherkinStreams.ts#L36
   * - if options.relativeTo is provided, uri in gherkin documents will be relative to it.
   *   See: https://github.com/cucumber/gherkin-streams/blob/main/src/SourceMessageStream.ts#L31
   * - options.defaultDialect is 'en' by default.
   *   See: https://github.com/cucumber/gherkin-streams/blob/main/src/makeGherkinOptions.ts#L5
   */
  async load(featureFiles: string[], options: IGherkinStreamOptions) {
    this.gherkinQuery = new GherkinQuery();
    this.parseErrors = [];
    let envelopes: Envelope[] = [];
    let gherkinFileParser: GherkinFileParser = QafGherkinFactory.getParser();
    // Without this early return gherkinFromPaths() produced weird behavior
    // for reporters: it does not keep exit code
    // See: https://github.com/vitalets/playwright-bdd/issues/200
    if (!featureFiles.length) return;
    // await gherkinFromPaths(featureFiles, options, (envelope) => {
    //   this.gherkinQuery.update(envelope);
    //   if (envelope.parseError) {
    //     this.parseErrors.push(envelope.parseError);
    //   }
    // });
    for(const path of featureFiles){
      let paths: string[] = [`${path}`];
      let envelopes_one: Envelope[] = await streamToArray(
        GherkinStreams.fromPaths(
          paths,
          options
        )
      )
      let qafDocuments: QafDocument[] = await gherkinFileParser.qafGherkinFromPaths(paths,options);
      let enve:Envelope = LodashUtil.setTable(envelopes_one[1],qafDocuments[0]);
      let pickls:Envelope[] = LodashUtil.genEnvelopesWithPickles(enve,qafDocuments[0]);
      for(const envelope of envelopes_one){
        envelopes.push(envelope);
        if (envelope.parseError) {
          this.parseErrors.push(envelope.parseError);
        }
      }
      for(const envelope of pickls){
        logger.log("pickles: " + JSON.stringify(envelope, null, 2));
        envelopes.push(envelope);
      }
    }
    envelopes.forEach((envelope) => {
      this.gherkinQuery.update(envelope);
    })
  }

  getDocumentsCount() {
    return this.gherkinQuery.getGherkinDocuments().length;
  }

  getDocumentsWithPickles(): GherkinDocumentWithPickles[] {
    return this.gherkinQuery.getGherkinDocuments().map((gherkinDocument) => {
      const pickles = this.getDocumentPickles(gherkinDocument);
      return { ...gherkinDocument, pickles };
    });
  }

  private getDocumentPickles(gherkinDocument: GherkinDocument) {
    return this.gherkinQuery
      .getPickles()
      .filter((pickle) => gherkinDocument.uri === pickle.uri)
      .map((pickle) => this.getPickleWithLocation(pickle));
  }

  private getPickleWithLocation(pickle: Pickle) {
    const lastAstNodeId = pickle.astNodeIds[pickle.astNodeIds.length - 1];
    logger.log("lastAstNodeId: " + lastAstNodeId);
    const location = this.gherkinQuery.getLocation(lastAstNodeId);
    logger.log("locations: " + JSON.stringify(location, null, 2));
    return { ...pickle, location };
  }
}

async function gherkinFromPaths(
  paths: string[],
  options: IGherkinStreamOptions,
  onEnvelope: (envelope: Envelope) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const gherkinMessageStream = GherkinStreams.fromPaths(paths, options);
    gherkinMessageStream.on('data', onEnvelope);
    gherkinMessageStream.on('end', resolve);
    gherkinMessageStream.on('error', reject);
  });
}

async function streamToArray(
  readableStream: Readable
): Promise<Envelope[]> {
  return new Promise<Envelope[]>(
    (
      resolve: (wrappers: Envelope[]) => void,
      reject: (err: Error) => void
    ) => {
      const items: Envelope[] = []
      readableStream.on('data', items.push.bind(items))
      readableStream.on('error', (err: Error) => reject(err))
      readableStream.on('end', () => resolve(items))
    }
  )
}
