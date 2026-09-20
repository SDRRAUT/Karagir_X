/**
 * Kalakar Setu - Cross-Platform Master Ecosystem Launcher
 * Launches:
 *  1. Admin Web Command Center (Port 3000)
 *  2. Artisan Studio (Port 2882)
 *  3. Buyer Marketplace (Port 2883)
 */

const { spawn, exec } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const mobileDir = path.join(rootDir, 'mobile');

console.log('===================================================================');
console.log('  Kalakar Setu ~ Launching Multi-Localhost Ecosystem');
console.log('===================================================================');
console.log('  [1] Artisan Studio:    http://localhost:2882');
console.log('  [2] Buyer Marketplace: http://localhost:2883');
console.log('  [3] Admin Dashboard:   http://localhost:3000');
console.log('===================================================================');

function openBrowser(url) {
  const startCmd =
    process.platform === 'win32'
      ? `start "" "${url}"`
      : process.platform === 'darwin'
      ? `open "${url}"`
      : `xdg-open "${url}"`;
  exec(startCmd, () => {});
}

// 1. Admin Web
const adminProc = spawn('node', ['admin-web/server.js'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
});

// 2. Artisan Studio (2882)
const artisanProc = spawn('npx', ['expo', 'start', '--port', '2882', '--localhost'], {
  cwd: mobileDir,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, WEB_PORT: '2882' },
});

// 3. Buyer Marketplace (2883)
const buyerProc = spawn('npx', ['expo', 'start', '--port', '2883', '--localhost'], {
  cwd: mobileDir,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, WEB_PORT: '2883' },
});

setTimeout(() => {
  console.log('\n[Launcher] Opening browser for all 3 endpoints...');
  openBrowser('http://localhost:2882');
  openBrowser('http://localhost:2883');
  openBrowser('http://localhost:3000');
}, 3500);

process.on('SIGINT', () => {
  console.log('\nStopping all services...');
  adminProc.kill();
  artisanProc.kill();
  buyerProc.kill();
  process.exit(0);
});
