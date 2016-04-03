

chrome.tabs.query(
  {currentWindow: true, active: true}, 
  function(tabs){
    var tab = tabs[0];
    var url = tab.url;
    $.ajax({ url: url, success: function(data) {

      var myTestDiv = document.createElement('div');
      myTestDiv.innerHTML = data;

      var metas = myTestDiv.getElementsByTagName('meta');
      for ( var i = 0; i < metas.length; i++ ) { 
          if ( metas[i].getAttribute("content") == "article" ) { 
            var title = myTestDiv.getElementsByTagName('title');
            $('#status').text("Title: " + title[0].innerHTML);

            contentRetrieval(title[0].innerHTML, url );
            return;
          } 
      } 
      $('#status').text("Current Page is not an Article.");
    }
  });
});

function contentRetrieval(title, url){
/////////////////////// API Key for Alchemy//////////////////////
// 20a7beb9768a548265f9896381f68fd1b0d18c70
//////////// API Key for summarizer // API smmry.com ///////////////
// 967B4F09D6
  var getURL = "http://gateway-a.watsonplatform.net/calls/url/URLGetText?apikey=20a7beb9768a548265f9896381f68fd1b0d18c70";
  getURL += "&url=" + url;
  var arrayOfSentences = null;
  var summary = [];
  $.get( getURL, function( data, status, xhr){
    var x = data.getElementsByTagName("text")[0];
    y = x.childNodes[0];
    z = y.nodeValue;
    arrayOfSentences = z.match( /[^\.!\?]+[\.!\?]+/g );
  });
  var getKeyWord = "http://gateway-a.watsonplatform.net/calls/url/URLGetRankedKeywords?apikey=20a7beb9768a548265f9896381f68fd1b0d18c70";
  getKeyWord += "&url=" + url;
  $.get( getKeyWord, function( data, status, xhr){
    x = data.getElementsByTagName("text")[0];
    y = x.childNodes[0];
    z = y.nodeValue;
    var count = 0;
    for( index = 0; index < arrayOfSentences.length; index++ ){
      if( arrayOfSentences[index].indexOf(z) > -1 ){
        summary += arrayOfSentences[index];
        count++;
      }
      if( count == 5 )
        break;
    }
    $('#content').text("Summary: " + summary);
    $('#url').text("Link: " + url);
    $('#inputs').html('<button id="save">Save Summary</button>');
    $('#inputs').append('<button id="restore">View Saved Summaries</button>');
    if( summary == [] ){
      $('#content').text("Unable to Summarize.");
    }
  })
};



function saveChanges(){
  var theSummary = document.getElementById("inside").innerHTML;
  //var theSummary = document.getElementById("content").innerHTML;
  //var theLink = document.getElementById("url").innerHTML;
  alert(localStorage["storeSummary"]);
  localStorage["storeSummary"] += theSummary;
}

