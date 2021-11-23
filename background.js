chrome.webRequest.onHeadersReceived.addListener(function(request) {
  const { url, responseHeaders, method } = request;
  if (url === 'https://gsp.target.com/gsp/oauth_tokens/v2/client_tokens' && method === 'POST') {
    let setCookieArray = [];
    for (let { name, value } of responseHeaders) {
      if (name === 'set-cookie') setCookieArray.push(value);
    }
    let validRefreshToken = setCookieArray.find(cookie => cookie.includes('refreshToken') && cookie.includes('TGT.'));
    if (validRefreshToken) {
      let validAccessToken = setCookieArray.find(cookie => cookie.includes('accessToken'));
      if (validAccessToken) {
        validAccessToken = validAccessToken.split('; ')[0].split('=')[1];
        chrome.storage.local.get('accessTokens', ({ accessTokens = [] }) => {
          accessTokens.push(validAccessToken);
          chrome.storage.local.set({ accessTokens });
        });
      }
    }
  }
}, {urls: ["<all_urls>"]}, ["extraHeaders", "responseHeaders"]);

function getCookieCount(elem) {
  chrome.storage.local.get('accessTokens', ({ accessTokens = [] }) => {
    elem.innerHTML = accessTokens.length;
  });
}

function clearCookieStore(elem) {
  chrome.storage.local.set({ accessTokens: [] });
  elem.innerHTML = 0;
}