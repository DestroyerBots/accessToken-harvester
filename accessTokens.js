document.getElementById("export").addEventListener("click", function() {
  chrome.storage.local.get('accessTokens', ({ accessTokens = [] }) => {
    if (accessTokens.length > 0) {
      let txt = '';
      for (const token of accessTokens) txt += token + '\n';
      let blob = new Blob([txt], {type: "text/plain"});
      let url = URL.createObjectURL(blob);
      chrome.downloads.download({ url });
      chrome.storage.local.set({ 'accessTokens': [] });
    }
  });
});

document.getElementById("reset").addEventListener("click", function() {
  chrome.extension.getBackgroundPage().clearCookieStore(document.getElementById("cookie-count"));
});

chrome.extension.getBackgroundPage().getCookieCount(document.getElementById("cookie-count"));
