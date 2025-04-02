"use strict";
/**
 * Load features.
 *
 * See: https://github.com/cucumber/cucumber-js/blob/main/src/api/load_sources.ts
 * See: https://github.com/cucumber/cucumber-js/blob/main/src/api/gherkin.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturesLoader = void 0;
exports.resolveFeatureFiles = resolveFeatureFiles;
const gherkin_streams_1 = require("@cucumber/gherkin-streams");
const gherkin_utils_1 = require("@cucumber/gherkin-utils");
const paths_1 = require("../utils/paths");
const utils_1 = require("../utils");
const lodashUtil_1 = require("../qafbdd/lodashUtil");
const qafGherkinFactory_1 = require("../qafbdd/qafGherkinFactory");
const logger_1 = require("../utils/logger");
let logger = new logger_1.Logger({ verbose: false });
function resolveFeatureFiles(cwd, patterns) {
    return (0, paths_1.resolveFiles)(cwd, (0, utils_1.toArray)(patterns), 'feature');
}
class FeaturesLoader {
    constructor() {
        this.gherkinQuery = new gherkin_utils_1.Query();
        this.parseErrors = [];
    }
    /**
     * Loads and parses feature files.
     * - featureFiles should be absolute.
     *   See: https://github.com/cucumber/gherkin-streams/blob/main/src/GherkinStreams.ts#L36
     * - if options.relativeTo is provided, uri in gherkin documents will be relative to it.
     *   See: https://github.com/cucumber/gherkin-streams/blob/main/src/SourceMessageStream.ts#L31
     * - options.defaultDialect is 'en' by default.
     *   See: https://github.com/cucumber/gherkin-streams/blob/main/src/makeGherkinOptions.ts#L5
     */
    async load(featureFiles, options) {
        this.gherkinQuery = new gherkin_utils_1.Query();
        this.parseErrors = [];
        let envelopes = [];
        let gherkinFileParser = qafGherkinFactory_1.QafGherkinFactory.getParser();
        // Without this early return gherkinFromPaths() produced weird behavior
        // for reporters: it does not keep exit code
        // See: https://github.com/vitalets/playwright-bdd/issues/200
        if (!featureFiles.length)
            return;
        // await gherkinFromPaths(featureFiles, options, (envelope) => {
        //   this.gherkinQuery.update(envelope);
        //   if (envelope.parseError) {
        //     this.parseErrors.push(envelope.parseError);
        //   }
        // });
        for (const path of featureFiles) {
            let paths = [`${path}`];
            let envelopes_one = await streamToArray(gherkin_streams_1.GherkinStreams.fromPaths(paths, options));
            let qafDocuments = await gherkinFileParser.qafGherkinFromPaths(paths, options);
            let enve = lodashUtil_1.LodashUtil.setTable(envelopes_one[1], qafDocuments[0]);
            let pickls = lodashUtil_1.LodashUtil.genEnvelopesWithPickles(enve, qafDocuments[0]);
            for (const envelope of envelopes_one) {
                envelopes.push(envelope);
                if (envelope.parseError) {
                    this.parseErrors.push(envelope.parseError);
                }
            }
            for (const envelope of pickls) {
                logger.log("pickles: " + JSON.stringify(envelope, null, 2));
                envelopes.push(envelope);
            }
        }
        envelopes.forEach((envelope) => {
            this.gherkinQuery.update(envelope);
        });
    }
    getDocumentsCount() {
        return this.gherkinQuery.getGherkinDocuments().length;
    }
    getDocumentsWithPickles() {
        return this.gherkinQuery.getGherkinDocuments().map((gherkinDocument) => {
            const pickles = this.getDocumentPickles(gherkinDocument);
            return { ...gherkinDocument, pickles };
        });
    }
    getDocumentPickles(gherkinDocument) {
        return this.gherkinQuery
            .getPickles()
            .filter((pickle) => gherkinDocument.uri === pickle.uri)
            .map((pickle) => this.getPickleWithLocation(pickle));
    }
    getPickleWithLocation(pickle) {
        const lastAstNodeId = pickle.astNodeIds[pickle.astNodeIds.length - 1];
        logger.log("lastAstNodeId: " + lastAstNodeId);
        const location = this.gherkinQuery.getLocation(lastAstNodeId);
        logger.log("locations: " + JSON.stringify(location, null, 2));
        return { ...pickle, location };
    }
}
exports.FeaturesLoader = FeaturesLoader;
async function gherkinFromPaths(paths, options, onEnvelope) {
    return new Promise((resolve, reject) => {
        const gherkinMessageStream = gherkin_streams_1.GherkinStreams.fromPaths(paths, options);
        gherkinMessageStream.on('data', onEnvelope);
        gherkinMessageStream.on('end', resolve);
        gherkinMessageStream.on('error', reject);
    });
}
async function streamToArray(readableStream) {
    return new Promise((resolve, reject) => {
        const items = [];
        readableStream.on('data', items.push.bind(items));
        readableStream.on('error', (err) => reject(err));
        readableStream.on('end', () => resolve(items));
    });
}
//# sourceMappingURL=load.js.map