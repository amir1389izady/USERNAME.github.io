// This file now acts as a "barrel" file, re-exporting components from their individual files.
// This resolves the "Identifier has already been declared" error by removing duplicate function definitions.

export { renderApkDownloadSection } from './components/apk-download.js';
export { renderCodeAnalyzerSection } from './components/code-analyzer.js';
export { renderCodeGeneratorSection } from './components/code-generator.js';
export { renderFileConverterSection } from './components/file-converter.js';
export { renderGamesSection } from './components/games.js';
export { renderMessageList } from './components/message-list.js';
export { renderModelGallery } from './components/model-gallery.js';
export { renderNews } from './components/news-renderer.js';
export { renderSoftwareBuilderSection } from './components/software-builder.js';
export { renderTranslatorSection } from './components/translator.js';
export { renderUploadSection } from './components/upload.js';
export { renderWebsiteBuilderLinkSection } from './components/website-builder-link.js';
export { renderXpEmulatorLinkSection } from './components/xp-emulator-link.js';