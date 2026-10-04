'use strict';
const { fs, path, ROOT, ensureDir } = require('./workspace');
async function withRunLock(action) {
  const file = path.join(ROOT, 'reports/.factory-lock.json'); ensureDir(path.dirname(file));
  if (fs.existsSync(file)) {
    const lock = JSON.parse(fs.readFileSync(file, 'utf8'));
    let alive = true;
    try { process.kill(lock.pid, 0); } catch (error) { if (error.code === 'ESRCH') alive = false; }
    if (alive) throw new Error(`Conflicting factory operation (PID ${lock.pid}). Wait for it to finish; it has not been stopped or steered.`);
    fs.unlinkSync(file); // Stale transient lock only; historical output is never removed.
  }
  const fd = fs.openSync(file, 'wx'); fs.writeFileSync(fd, JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() })); fs.closeSync(fd);
  try { return await action(); } finally { fs.unlinkSync(file); }
}
module.exports = { withRunLock };
