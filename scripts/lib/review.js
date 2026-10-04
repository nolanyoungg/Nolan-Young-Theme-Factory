'use strict';
const { fs, path, ROOT, readJson, treeHash, ensureInside } = require('./workspace');
function readReview(evidenceFile, dir) {
  if (!evidenceFile) return { browserChecks: { status: 'skipped', reason: 'No browser evidence supplied. Use the preview server, inspect desktop/mobile screenshots, then pass --review-evidence to resume.' }, visualReview: { status: 'pending', reason: 'Actual screenshots require human or agent visual inspection.' } };
  const file = path.resolve(ROOT, evidenceFile); ensureInside(path.join(ROOT, 'reports'), file);
  const evidence = readJson(file);
  if (evidence.sampleHash !== treeHash(dir)) throw new Error('Review evidence is stale: sample hash differs.');
  for (const kind of ['browserChecks', 'visualReview']) {
    if (!['passed', 'failed', 'skipped'].includes(evidence[kind]?.status)) throw new Error(`Review evidence must explicitly record ${kind} status.`);
  }
  if (evidence.browserChecks.status === 'passed') {
    for (const check of ['navigation', 'interactions', 'console', 'requests', 'overflow', 'clipping']) if (evidence.browserChecks[check] !== 'passed') throw new Error(`Browser check ${check} must be recorded separately.`);
    if (!Array.isArray(evidence.viewports) || !evidence.viewports.some(v => v.width <= 400) || !evidence.viewports.some(v => v.width >= 1200)) throw new Error('Desktop and mobile review evidence required.');
  }
  if (evidence.visualReview.status === 'passed') {
    if (!evidence.visualReview.notes || !evidence.screenshots?.length) throw new Error('Screenshot paths and actual visual review notes required.');
    for (const shot of evidence.screenshots) { const p = path.resolve(ROOT, shot); ensureInside(path.join(ROOT, 'reports'), p); if (!fs.existsSync(p) || !fs.statSync(p).size) throw new Error(`Missing screenshot: ${shot}`); }
  }
  return { browserChecks: evidence.browserChecks, visualReview: evidence.visualReview, reviewEvidence: path.relative(ROOT, file).replace(/\\/g, '/') };
}
module.exports = { readReview };
