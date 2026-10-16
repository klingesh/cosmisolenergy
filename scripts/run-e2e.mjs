import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const cli = require.resolve('@playwright/test/cli');
const server = spawn(process.execPath, ['scripts/playwright-server.mjs'], { stdio: 'inherit' });

for (let attempt = 0; attempt < 50; attempt += 1) {
  try {
    const response = await fetch('http://127.0.0.1:3000');
    if (response.ok) break;
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
}

const tests = spawn(process.execPath, [cli, 'test', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: process.env,
});
const code = await new Promise((resolve) => tests.on('exit', (value) => resolve(value ?? 1)));

if (process.platform === 'win32' && server.pid) {
  spawnSync('taskkill', ['/PID', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
} else {
  server.kill('SIGTERM');
}
process.exit(code);
