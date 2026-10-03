'use strict';

// Byte count does not measure a redesign: unrelated stylesheets can have the
// same length. Compare token sequences, ignoring comments and formatting.
function stylesheetShingles(css) {
  const source = css.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\*[\s\S]*?\*\//g,
    (part) => part.startsWith('/*') ? '' : part);
  const tokens = source.match(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[\w.#%-]+|[^\s]/g) || [];
  const shingles = new Set();
  const width = Math.min(5, tokens.length);
  for (let i = 0; width && i <= tokens.length - width; i += 1) {
    shingles.add(JSON.stringify(tokens.slice(i, i + width)));
  }
  return shingles;
}

function compareStylesheets(generated, starter) {
  const current = stylesheetShingles(generated);
  const baseline = stylesheetShingles(starter);
  const shared = [...current].filter((item) => baseline.has(item)).length;
  const union = current.size + baseline.size - shared;
  const similarity = union ? shared / union : 1;
  return { similarity, substantiallyUnchanged: similarity >= 0.85 };
}

module.exports = { compareStylesheets };
