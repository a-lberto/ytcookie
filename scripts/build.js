const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const chromeBuildDir = path.join(distDir, 'chrome-build');
const firefoxBuildDir = path.join(distDir, 'firefox-build');

console.log('🧹 Cleaning up dist directory...');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(chromeBuildDir, { recursive: true });
fs.mkdirSync(firefoxBuildDir, { recursive: true });

console.log('📂 Copying files...');
// Copy background.js
fs.copyFileSync(path.join(rootDir, 'background.js'), path.join(chromeBuildDir, 'background.js'));
fs.copyFileSync(path.join(rootDir, 'background.js'), path.join(firefoxBuildDir, 'background.js'));

// Copy icons directory
fs.cpSync(path.join(rootDir, 'icons'), path.join(chromeBuildDir, 'icons'), { recursive: true });
fs.cpSync(path.join(rootDir, 'icons'), path.join(firefoxBuildDir, 'icons'), { recursive: true });

console.log('📝 Reading manifest.json...');
const manifestPath = path.join(rootDir, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Prepare Firefox manifest (keeps browser_specific_settings, removes web_accessible_resources, removes service_worker)
console.log('🦊 Building Firefox manifest...');
const firefoxManifest = JSON.parse(JSON.stringify(manifest));
delete firefoxManifest.web_accessible_resources;
if (firefoxManifest.background) {
  delete firefoxManifest.background.service_worker;
  delete firefoxManifest.background.type;
}
fs.writeFileSync(
  path.join(firefoxBuildDir, 'manifest.json'),
  JSON.stringify(firefoxManifest, null, 2),
  'utf8'
);

// Prepare Chrome manifest (removes browser_specific_settings, removes web_accessible_resources, removes scripts)
console.log('🌐 Building Chrome manifest...');
const chromeManifest = JSON.parse(JSON.stringify(manifest));
delete chromeManifest.browser_specific_settings;
delete chromeManifest.web_accessible_resources;
if (chromeManifest.background) {
  delete chromeManifest.background.scripts;
}
fs.writeFileSync(
  path.join(chromeBuildDir, 'manifest.json'),
  JSON.stringify(chromeManifest, null, 2),
  'utf8'
);

console.log('✨ Build directories prepared under dist/!');
