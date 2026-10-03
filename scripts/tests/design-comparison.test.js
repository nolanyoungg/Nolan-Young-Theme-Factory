'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { compareStylesheets } = require('../lib/design-comparison');

const starter = Array.from({ length: 30 }, (_, i) => `.service-${i}{display:grid;gap:${i + 12}px;background:#2563eb;padding:24px}`).join('');

test('formatting, comment padding, and a small override do not pass as a redesign', () => {
  assert.equal(compareStylesheets(starter, starter).substantiallyUnchanged, true);
  assert.equal(compareStylesheets(`/* ${'padding '.repeat(1000)} */\n${starter.replaceAll(';', ';\n')}`, starter).substantiallyUnchanged, true);
  assert.equal(compareStylesheets(`${starter}.hero{color:red}`, starter).substantiallyUnchanged, true);
  assert.equal(compareStylesheets(starter + starter, starter).substantiallyUnchanged, true);
});

test('a substantially different stylesheet can have exactly the same byte count', () => {
  const redesign = '.gallery{columns:3;column-gap:2rem}.caption{font:italic 2rem Georgia;color:#423a2b}@media(max-width:600px){.gallery{columns:1}}';
  const sameSize = redesign.padEnd(starter.length, ' ');
  assert.equal(Buffer.byteLength(sameSize), Buffer.byteLength(starter));
  assert.equal(compareStylesheets(sameSize, starter).substantiallyUnchanged, false);
});

test('comments inside quoted CSS values remain meaningful content', () => {
  assert.equal(compareStylesheets('.a{content:"/* x */"}', '.a{content:"/* y */"}').substantiallyUnchanged, false);
  assert.equal(compareStylesheets('', '').substantiallyUnchanged, true);
});
