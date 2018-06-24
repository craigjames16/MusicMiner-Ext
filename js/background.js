var API_URL = 'http://musicminer-prod.ca-central-1.elasticbeanstalk.com/';
// var API_URL = 'http://localhost:8000';

function checkSourceFromUrl(url) {
    //Return 1 for Youtube, 2 for HypeM, and 3 for SoundCloud
    let YT
    let SC

    YT = url.search(/(watch\?v\=)([A-Za-z0-9\-]+)/);
    if (YT != -1) {
        return 'youtube';
    }

    SC = url.search(/(api.soundcloud.com\/i1\/tracks\/)([A-Za-z0-9\-]+)/);
    if (SC != -1) {
        return 'soundcloud';
    }

    return false;
    
}
function getSoundcloudIdFromUrl(url) {
    var id = url.substr(29+8, 9);
    return id; 
}

function getYoutubeIdFromUrl(url) {
    var id = url.substr(24+8, 11);
    return id; 
}

function sendPlay(source,source_id,soundcloud_id) {
    fetch(
        API_URL+'/collector/play/add/'+source_id+'/?source='+source,
        {  
            method: 'post',  
            headers: {  
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
            },  
            body: 'source='+source+'&source_id='+source_id+'&soundcloud_id='+soundcloud_id,
            credentials:'include'
        }
    )
  .then(function(response) {

  });
}

//HypeM Catcher
chrome.runtime.onMessage.addListener(   
  function(request, sender, sendResponse) {
    request = JSON.parse(request);
    if (request['itemid']) {
        var details = {}
        details['url'] = request['url']

        soundcloud_id = details.url.substr(7+26, 9);
        sendPlay('hypem',request['itemid'], soundcloud_id);
    }
}
);

//Youtube & Soundcloud Catcher
chrome.webRequest.onCompleted.addListener( function(details) {
    var source;
    if (details.method == 'GET') {
        source = checkSourceFromUrl(details['url']);
        if (source) {
            switch(source) {
                case 'youtube': {
                    youtube_id = getYoutubeIdFromUrl(details['url'])
                    sendPlay('youtube',youtube_id,'');
                    break;
                }
                case 'soundcloud': {
                    soundcloud_id = getSoundcloudIdFromUrl(details['url'])
                    sendPlay('soundcloud',soundcloud_id,'');
                    try {
                        console.log('trying')
                        chrome.notifications.update('playadded',{title:"Play Added", message:'Play has been added1', type:'basic', iconUrl:'icon16.png'});    
                    } catch(error) {
                        console.log(error)
                    }
                    break;
                }
                default: {
                    break;
                }
            }
            chrome.notifications.getAll(function(notifications) {
                console.log(notifications);
            })
        }
    }   

    },
    {urls: ["<all_urls>"]},
    []);