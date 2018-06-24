export function checkPlayFromUrl(details) {
    //Return 1 for Youtube, 2 for HypeM, and 3 for SoundCloud
    let YT
    let HM
    let SC

    YT = details.url.search(/(watch\?v\=)([A-Za-z0-9\-]+)/);
    if (YT != -1) {
        return 'youtube';
    }
    HM = details.url.search(/(type=favorites&id=)([A-Za-z0-9\-]+)/);
    if (HM != -1) {
        return 'hypem';
    }
    SC = details.url.search(/(api.soundcloud.com\/i1\/tracks\/)([A-Za-z0-9\-]+)/);
    if (SC != -1) {
        return 'soundcloud';
    }

    return false;
    
}

export function getIdFromUrl(source,details) {
    switch(source) {
            case 'youtube':
                var id = details.url.substr(SC+29, 9);
                console.log(id)
                return id;
                
                break;

            case 'hypem':
                var id = details.url.substr(HM+18, 5);
                console.log(id);
                return id;
                break;
            case 'soundcloud':
                 var id = details.url.substr(YT+8, 11);
                 return id;
                break;
            default:
                return false;
                break;

        }        
}

export function sendPlay(source,source_id) {
    fetch(
        API_URL+'/user/addplay/',
        {  
            method: 'post',  
            headers: {  
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
            },  
            body: 'source='+source+'&source_id='+source_id ,
            credentials:'include'
        }
    )
  .then(function(response) {

  });
}