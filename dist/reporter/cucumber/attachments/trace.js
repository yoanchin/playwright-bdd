"use strict";
/**
 * Copy trace viewer to the report folder.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyTraceViewer = copyTraceViewer;
exports.isTraceAttachment = isTraceAttachment;
exports.generateTraceUrl = generateTraceUrl;
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const paths_1 = require("../../../utils/paths");
function getTraceViewerFolder() {
    const pwCorePath = require.resolve('playwright-core');
    // See: https://github.com/microsoft/playwright/blob/94321fef1c94f9851b6fcc4304d3844760e986cb/packages/playwright/src/reporters/html.ts#L314
    return node_path_1.default.join(pwCorePath, '..', 'lib', 'vite', 'traceViewer');
}
// eslint-disable-next-line visual/complexity
async function copyTraceViewer(reportDir) {
    const traceViewerFolder = getTraceViewerFolder();
    const traceViewerTargetFolder = node_path_1.default.join(reportDir, 'trace');
    const traceViewerAssetsTargetFolder = node_path_1.default.join(traceViewerTargetFolder, 'assets');
    node_fs_1.default.mkdirSync(traceViewerAssetsTargetFolder, { recursive: true });
    for (const file of node_fs_1.default.readdirSync(traceViewerFolder)) {
        if (file.endsWith('.map') || file.includes('watch') || file.includes('assets'))
            continue;
        await (0, paths_1.copyFileAndMakeWritable)(node_path_1.default.join(traceViewerFolder, file), node_path_1.default.join(traceViewerTargetFolder, file));
    }
    for (const file of node_fs_1.default.readdirSync(node_path_1.default.join(traceViewerFolder, 'assets'))) {
        if (file.endsWith('.map') || file.includes('xtermModule'))
            continue;
        await (0, paths_1.copyFileAndMakeWritable)(node_path_1.default.join(traceViewerFolder, 'assets', file), node_path_1.default.join(traceViewerAssetsTargetFolder, file));
    }
}
function isTraceAttachment(attachment) {
    return attachment.fileName === 'trace';
}
function generateTraceUrl(attachment) {
    // In PW trace url is generated dynamically in JS with location.href:
    // https://github.com/microsoft/playwright/blob/8f3353865d8d98e9b40c15497e60d5e2583410b6/packages/html-reporter/src/links.tsx#L102
    return `trace/index.html?trace=${attachment.url}`;
}
//# sourceMappingURL=trace.js.map