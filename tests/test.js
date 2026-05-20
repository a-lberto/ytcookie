const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const assert = require('assert');

(async () => {
  const extensionPath = path.resolve(__dirname, '..');
  const userDataDir = path.resolve(__dirname, 'temp/profile');
  const downloadPath = path.resolve(__dirname, 'temp/downloads');

  if (fs.existsSync(userDataDir)) fs.rmSync(userDataDir, { recursive: true, force: true });
  if (fs.existsSync(downloadPath)) fs.rmSync(downloadPath, { recursive: true, force: true });
  if (!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath, { recursive: true });
  const isCI = process.env.CI === 'true';
  console.log('🚀 Launching browser with extension...');
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
      isCI ? '--headless=new' : ''
    ].filter(Boolean),
    acceptDownloads: true,
  });

  // Listen to worker logs
  context.on('serviceworker', sw => {
    console.log('[SW] Worker detected:', sw.url());
    sw.on('console', msg => console.log(`[SW] ${msg.text()}`));
  });

  try {
    // 1. Get Extension ID
    console.log('🔍 Identifying extension...');
    let worker;
    const startTime = Date.now();
    while (Date.now() - startTime < 10000) {
        worker = context.serviceWorkers().find(w => w.url().startsWith('chrome-extension://'));
        if (worker) break;
        await new Promise(r => setTimeout(r, 500));
    }

    let extensionId;
    if (worker) {
        extensionId = worker.url().split('/')[2];
    } else {
        console.log('Trying fallback: check all pages for extension scheme...');
        for (const p of context.pages()) {
            if (p.url().startsWith('chrome-extension://')) {
                extensionId = p.url().split('/')[2];
                break;
            }
        }
    }

    
    if (!extensionId) throw new Error('Extension ID not found');
    console.log('✅ Extension ID:', extensionId);

    // 2. Prepare mock cookies
    console.log('🍪 Setting mock cookies...');
    const pages = context.pages();
    const ytPage = pages.length > 0 ? pages[0] : await context.newPage();
    await ytPage.goto('https://www.youtube.com');
    await context.addCookies([{
        name: 'YT_TEST',
        value: 'verified-cookie-ci',
        domain: '.youtube.com',
        path: '/',
        expires: Math.floor(Date.now() / 1000) + 3600,
        secure: true,
        httpOnly: true,
    }]);

    // 3. Navigate to test trigger page and click
    console.log('⚡ Triggering extraction via test page...');
    const triggerPage = await context.newPage();
    await triggerPage.goto(`chrome-extension://${extensionId}/tests/trigger.html`);
    
    const [download] = await Promise.all([
      context.waitForEvent('download', { timeout: 15000 }),
      triggerPage.click('#trigger')
    ]);

    const filePath = path.join(downloadPath, download.suggestedFilename());
    await download.saveAs(filePath);
    console.log('📥 Downloaded to:', filePath);

    const content = fs.readFileSync(filePath, 'utf8');
    assert(content.includes('verified-cookie-ci'), 'Cookie content mismatch');
    console.log('✨ TEST PASSED: Extension verified successfully!');

  } catch (err) {
    console.error('❌ TEST FAILED:', err);
    process.exit(1);
  } finally {
    await context.close();
  }
})();
