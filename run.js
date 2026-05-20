const { firefox } = require('playwright');
const path = require('path');

(async () => {
  const extensionPath = path.resolve(__dirname);
  console.log('Launching Firefox with extension from:', extensionPath);
  
  const context = await firefox.launchPersistentContext('', {
    headless: false,
    args: [
      `--load-extension=${extensionPath}`,
    ],
  });

  console.log('Browser launched. Close the window to stop.');
  
  // Keep it open
  context.on('close', () => process.exit());
})();
