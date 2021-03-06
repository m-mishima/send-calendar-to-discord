function myFunction() {
  
  var list = "";

  var startTime = new Date();
  var endTime = new Date( Date.parse( startTime ) + (10+24)*60*60*1000 );
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

function listupEvent( cal_id, startTime, endTime, options ) {
  var list = "";
  var cal = CalendarApp.getCalendarById(cal_id);
  var events = cal.getEvents( startTime, endTime, options );
  for(var i=0; i < events.length; i++){
    var ts = "";
    var tsc = "";
    var te = "";
    var tec = "";
    var s = "";
    tsc = Utilities.formatDate( events[i].getStartTime(), "JST", "MM月dd日" );
    tec = Utilities.formatDate( events[i].getEndTime(),   "JST", "MM月dd日" );
    ts = getjapaneserelativeday( events[i].getStartTime() );
    te = getjapaneserelativeday( events[i].getEndTime() );

    if ( ts != "" ) {
      tsc += "(" + ts + ")";
    }
    if ( te != "" ) {
      tec += "(" + te + ")";
    }

    if ( events[i].isAllDayEvent() ) {
      s += tsc;
      if ( tsc != tec ) {
        s += "～" + tec;  // 複数日に渡っている
      }
    } else {
      s += tsc;
      s += Utilities.formatDate(events[i].getStartTime(), "JST", " HH:mm"  );
      s += "～";
      if ( tsc != tec ) {
        s += tec;
        s += " ";
      }
      s += Utilities.formatDate(events[i].getEndTime(),   "JST", "HH:mm" );
    }

    s += "  " + events[i].getTitle();
    //Logger.log(s);

    list += s + "\n";
  }

  return list;
}

function getjapaneserelativeday( tdate ) {
  var tnow = new Date();
  var tsototoi = Utilities.formatDate( new Date( Date.parse( tnow ) - 48*60*60*1000 ), "JST", "MM月dd日" );
  var tskinou  = Utilities.formatDate( new Date( Date.parse( tnow ) - 24*60*60*1000 ), "JST", "MM月dd日" );
  var tskyou   = Utilities.formatDate( new Date( Date.parse( tnow ) +  0*60*60*1000 ), "JST", "MM月dd日" );
  var tsashita = Utilities.formatDate( new Date( Date.parse( tnow ) + 24*60*60*1000 ), "JST", "MM月dd日" );
  var tsasatte = Utilities.formatDate( new Date( Date.parse( tnow ) + 48*60*60*1000 ), "JST", "MM月dd日" );
  var t = "";
  var tsc = Utilities.formatDate( tdate, "JST", "MM月dd日" );
  switch( tsc ) {
    case tsototoi:
      t = "一昨日";
      break;
    case tskinou:
      t = "昨日";
      break;
    case tskyou:
      t = "今日";
      break;
    case tsashita:
      t = "明日";
      break;
    case tsasatte:
      t = "明後日";
      break;
    default:
      break;
  }
  return t;
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
