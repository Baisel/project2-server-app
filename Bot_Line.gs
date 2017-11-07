var CHANNEL_ACCESS_TOKEN = 'LINE_token';  //←LINEのアクセストークン
var CHAT_BOT_ACCESS_TOKEN = 'Chat_bot_token'; //←user localのAPIkey
var chat_endpoint = 'https://chatbot-api.userlocal.jp/api/chat';
var line_endpoint = 'https://api.line.me/v2/bot/message/reply';


function doPost(e) {
  var reply_token = JSON.parse(e.postData.contents).events[0].replyToken;
  if (typeof reply_token === 'undefined') {
    return;
  }
  var user_message = JSON.parse(e.postData.contents).events[0].message.text;

  var res = UrlFetchApp.fetch(
    chat_endpoint + '?key=' + encodeURIComponent(CHAT_BOT_ACCESS_TOKEN) + '&message=' + encodeURIComponent(user_message)
  );
  var replay_text = JSON.parse(res).result;

  UrlFetchApp.fetch(line_endpoint, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': reply_token,
      'messages': [
        {'type': 'text', 'text': replay_text},
      ],
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}
