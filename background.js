let ws;
let isCrawling = false;

function startCrawling() {
  if (!isCrawling) {
    connectToWebSocket();
    isCrawling = true;
  }
}

function stopCrawling() {
  if (isCrawling) {
    ws.close();
    isCrawling = false;
  }
}

function onMessageFromContentScript(message, sender, sendResponse) {
  if (message.action === "getMatches") {
    let matches = getMatches();
    sendResponse(matches);
  } else if (message.action === "getOdds") {
    let odds = getOdds(message.matchId);
    sendResponse(odds);
  }
}

function onWebSocketMessage(event) {
  let data = JSON.parse(event.data);
  if (data.type === "cm") {
    sendMessageToPopup({
      action: "updateMatches",
      data: data.data,
    });
  } else if (data.type === "mc") {
    sendMessageToContentScript({
      action: "updateOdds",
      data: data.data,
    });
  }
}

function connectToWebSocket() {
  ws = new WebSocket("wss://www.365scores.com/websocket");

  ws.onopen = function () {
    ws.send(JSON.stringify({ 101: "0:0" }));
  };

  ws.onmessage = function (event) {
    onWebSocketMessage(event);
  };
}

function sendMessageToContentScript(message) {
  chrome.tabs.query({ url: "*://www.365scores.com/*" }, function (tabs) {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, message);
    }
  });
}

function sendMessageToPopup(message) {
  chrome.runtime.sendMessage(message);
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener(onMessageFromContentScript);