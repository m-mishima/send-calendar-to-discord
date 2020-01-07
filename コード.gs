function myFunction() {
  
  var list = "";

  var startTime = new Date();
  var endTime = new Date( Date.parse( startTime ) + 10*60*60*1000 );
  var options = {
  };
  var calendarId = "xxxxxxxxxxxxxxxxxxxxxxxxxx@group.calendar.google.com"; // a.GoogleカレンダーのID

  var discordWebHookURL = "https://discordapp.com/api/webhooks/xxxxxxxxxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
  
  list = listupEvent( calendarId, startTime, endTime, options );

  //Logger.log(list);

  if (list != "") {
    var payload = {
      "content" : "カレンダーイベント\n" + list, // c.メッセージの本文
    }

    postDiscord( discordWebHookURL, payload );
  }
}

function listupEvent( cal_id, startTime, endTime, options )
{
  var list = "";
  var cal = CalendarApp.getCalendarById(cal_id);
  var events = cal.getEvents( startTime, endTime, options );
  for(var i=0; i < events.length; i++){
    s = "";
    if (events[i].isAllDayEvent()) {
      s += Utilities.formatDate(events[i].getStartTime(),"GMT+0900","MM/dd  ");
    } else {
      s += Utilities.formatDate(events[i].getStartTime(),"GMT+0900","MM/dd HH:mm");
      s += Utilities.formatDate(events[i].getEndTime(), "GMT+0900","-HH:mm  ");
    }
    s += events[i].getTitle();
    //Logger.log(s);

    list += s + "\n";
  }

  return list;
}

function postDiscord( discordWebHookURL, payload )
{
  var options = {
    "method" : "POST",
    "headers": {"Content-type":"application/json"},
    "payload" : JSON.stringify( payload )
  }

  var response = UrlFetchApp.fetch( discordWebHookURL, options );
  var content = response.getContentText("UTF-8");

  //Logger.log( content );
}