document.getElementById('trigger').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'test-extract' });
});
