// 定義變數
let isCrawling = false; // 是否正在爬取資料
let crawlingIntervalId = null; // 爬取資料的計時器ID
const INTERVAL_TIME = 30000; // 爬取資料的間隔時間，單位為毫秒

// 開始爬取資料
function startCrawling() {
  if (isCrawling) return;
  
  isCrawling = true;
  updatePopupUI();
  
  // 設置定時器，定時爬取資料
  crawlingIntervalId = setInterval(() => {
    sendMessageToBackground('getMatches');
    sendMessageToBackground('getOdds');
  }, INTERVAL_TIME);
}

// 停止爬取資料
function stopCrawling() {
  if (!isCrawling) return;
  
  isCrawling = false;
  updatePopupUI();
  
  // 清除定時器
  clearInterval(crawlingIntervalId);
}

// 更新彈出視窗中的資訊
function updatePopupUI() {
  const startButton = document.getElementById('start-button');
  const stopButton = document.getElementById('stop-button');
  
  if (isCrawling) {
    startButton.disabled = true;
    stopButton.disabled = false;
  } else {
    startButton.disabled = false;
    stopButton.disabled = true;
  }
}

// 向background script發送消息
function sendMessageToBackground(message) {
  chrome.runtime.sendMessage({ message });
}

// 當文檔已準備好時執行
document.addEventListener('DOMContentLoaded', function() {
  // 綁定按鈕事件
  const startButton = document.getElementById('start-button');
  startButton.addEventListener('click', startCrawling);

  const stopButton = document.getElementById('stop-button');
  stopButton.addEventListener('click', stopCrawling);

  // 更新彈出視窗中的資訊
  updatePopupUI();
});