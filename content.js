// 設置消息監聽器，接收background script發送的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'getMatches') {
    // 提取比賽的資訊
    var matches = getMatches();
    // 將資訊發送回background script
    sendMessageToBackground('matches', matches);
  } else if (request.action === 'getOdds') {
    // 提取賠率資訊
    var odds = getOdds();
    // 將資訊發送回background script
    sendMessageToBackground('odds', odds);
  }
});

// 提取比賽的資訊
function getMatches() {
  var matches = [];
  // 遍歷所有的比賽行
  $('div[data-sport-id="1"] div[data-event-id]').each(function () {
    var match = {};
    match.homeTeam = $(this).find('.sl-CouponParticipantWithBookCloses_Name').eq(0).text().trim();
    match.awayTeam = $(this).find('.sl-CouponParticipantWithBookCloses_Name').eq(1).text().trim();
    matches.push(match);
  });
  return matches;
}

// 提取賠率資訊
function getOdds() {
  var odds = {};
  // 遍歷所有的賠率行
  $('div[data-sport-id="1"] div[data-event-id]').each(function () {
    var eventId = $(this).attr('data-event-id');
    var marketType = $(this).find('.gl-MarketGroupButton_Text').text().trim();
    var selectionOdds = {};
    $(this).find('.gl-ParticipantOddsOnly_Odds').each(function () {
      var selectionName = $(this).prev('.gl-ParticipantOddsOnly_Name').text().trim();
      var selectionOddsValue = $(this).text().trim();
      selectionOdds[selectionName] = selectionOddsValue;
    });
    odds[eventId] = {
      marketType: marketType,
      selectionOdds: selectionOdds,
    };
  });
  return odds;
}

// 向background script發送消息
function sendMessageToBackground(type, data) {
  chrome.runtime.sendMessage({
    type: type,
    data: data,
  });
}