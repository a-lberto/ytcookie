const api = typeof browser !== 'undefined' ? browser : chrome;

// This function is injected into a YouTube tab to trigger the download
function triggerDownload(content, fileName) {
    try {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 1000);
        console.log('YouTube cookie download triggered');
    } catch (e) {
        console.error('Download failed:', e);
    }
}

async function runExtraction(tab) {
    try {
        const cookies = await api.cookies.getAll({ domain: ".youtube.com" });
        
        // Find a suitable tab for injection (must be a page where we have host permissions)
        let targetTabId = null;
        const ytTabs = await api.tabs.query({ url: "*://*.youtube.com/*" });
        
        if (ytTabs.length > 0) {
            targetTabId = ytTabs[0].id;
        } else if (tab && tab.url && !tab.url.startsWith('chrome-extension://')) {
            targetTabId = tab.id;
        }

        if (cookies.length === 0) {
            console.log('No YouTube cookies found');
            if (targetTabId) {
                await api.scripting.executeScript({
                    target: { tabId: targetTabId },
                    func: () => alert('No YouTube cookies found. Please make sure you are logged in to YouTube.')
                });
            }
            return;
        }

        let netscapeFormat = "# Netscape HTTP Cookie File\n\n";
        for (const cookie of cookies) {
            const domain = cookie.domain;
            const flag = domain.startsWith('.') ? "TRUE" : "FALSE";
            const path = cookie.path;
            const secure = cookie.secure ? "TRUE" : "FALSE";
            const expiration = cookie.expirationDate ? Math.round(cookie.expirationDate) : 0;
            netscapeFormat += `${domain}\t${flag}\t${path}\t${secure}\t${expiration}\t${cookie.name}\t${cookie.value}\n`;
        }

        if (!targetTabId) {
            console.error('No suitable tab found for injection');
            return;
        }

        // Inject the download trigger
        await api.scripting.executeScript({
            target: { tabId: targetTabId },
            func: triggerDownload,
            args: [netscapeFormat, 'ytcookie.txt']
        });
    } catch (e) {
        console.error('Extraction error:', e);
    }
}

// Triggered when extension icon is clicked
(api.action || api.browser_action).onClicked.addListener(runExtraction);

// Added for automated testing
api.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'test-extract') {
        api.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
            if (tab) runExtraction(tab);
        });
    }
});
