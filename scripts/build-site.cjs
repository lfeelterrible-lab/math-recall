const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const projectRoot = path.resolve(__dirname, '..');
const exportDir = path.join(projectRoot, '.expo', 'export-site');
const distDir = path.join(projectRoot, 'dist');
const clientDir = path.join(distDir, 'client');
const serverDir = path.join(distDir, 'server');
const rootBuild = process.argv.includes('--root');
const baseUrl = process.env.EXPO_BASE_URL || (rootBuild ? '/' : '/math-recall');
const appConfigPath = path.join(projectRoot, 'app.json');
let originalAppConfig;

if (rootBuild) {
  originalAppConfig = fs.readFileSync(appConfigPath);
  const appConfig = JSON.parse(originalAppConfig.toString('utf8'));
  const expoConfig = appConfig.expo ?? appConfig;
  expoConfig.experiments = { ...expoConfig.experiments, baseUrl: '/' };
  fs.writeFileSync(appConfigPath, JSON.stringify(appConfig, null, 2));
}

fs.rmSync(exportDir, { recursive: true, force: true });
fs.rmSync(distDir, { recursive: true, force: true });

const expoCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const result = spawnSync(
  expoCommand,
  ['expo', 'export', '--platform', 'web', '--output-dir', exportDir],
  {
    cwd: projectRoot,
    env: { ...process.env, EXPO_BASE_URL: baseUrl },
    stdio: 'inherit',
    shell: process.platform === 'win32',
  },
);

if (originalAppConfig) {
  fs.writeFileSync(appConfigPath, originalAppConfig);
}

if (result.error) {
  console.error(result.error.message);
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

fs.mkdirSync(clientDir, { recursive: true });
fs.mkdirSync(serverDir, { recursive: true });
fs.cpSync(exportDir, clientDir, { recursive: true });
fs.writeFileSync(path.join(clientDir, '.nojekyll'), '');
fs.copyFileSync(path.join(__dirname, 'site-worker.mjs'), path.join(serverDir, 'index.js'));

// GitHub Pages serves static route directories more reliably than extensionless
// .html files, so mirror Expo's route documents as /route/index.html too.
for (const file of fs.readdirSync(clientDir)) {
  if (!file.endsWith('.html') || file === 'index.html' || file.startsWith('+') || file.startsWith('_')) {
    continue;
  }

  const routeDir = path.join(clientDir, path.basename(file, '.html'));
  fs.mkdirSync(routeDir, { recursive: true });
  fs.copyFileSync(path.join(clientDir, file), path.join(routeDir, 'index.html'));
}

// Keep client-side navigation alive for any direct GitHub Pages entry.
fs.copyFileSync(path.join(clientDir, 'index.html'), path.join(clientDir, '404.html'));

console.log(`MathRecall site output ready at ${distDir} (base URL: ${baseUrl})`);
