window.onload = function(){ 
    $('body').on('click', 'a', function(){
         chrome.tabs.create({url: $(this).attr('href')});
         return false;
    });

    var API_URL = 'http://api.craigchisholm.me';
    var APP_URL = 'http://trackpond.craigchisholm.me';
    
    function loadPage() {
        checkLogin()
    }

    function checkLogin() {
        $.ajax({
            url: API_URL+'/user/checklogin/',
            dataType: 'json',
            method: 'POST',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(data, textStatus,jqXHR) {
                var username = data.user.displayname;
                $('#connect').html('<p><a href="'+APP_URL+'/MyPond">'+username+'</a></p>');
                getPlays();
            },
            error: function( jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == 401) {
                     $("#track-list").html('<h2>Connect an account to get started!</h2><br >\
                    <a href="https://accounts.spotify.com/authorize/?client_id=84aa4ce44f674897949f684ffb2fa341&response_type=code&redirect_uri=http://trackpond.craigchisholm.me/connect/?source=spotify&scope=user-read-private%20user-read-email&state=spotify">\
                        <img src="./img/sp-icon.png" class="connect-icon" />\
                    </a>\
                    <a href="https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/youtube&access_type=offline&include_granted_scopes=true&redirect_uri=http://trackpond.craigchisholm.me/connect/?source=youtube&response_type=code&client_id=138806318897-10ab2q5qi8tq07nl6s3u050i7iq7hq91.apps.googleusercontent.com">\
                        <img src="./img/yt-icon.png" class="connect-icon" />\
                    </a>')
                }
            }
        });
    }

    function getURL(track) {
        var youtubeURL = '';
        var spotifyURL = '';
        var soundcloudURL = '';

        if (track.youtube.items) {
            youtubeURL = '<a href="http://www.youtube.com/watch?v=' + track.youtube.items[0].id +' target="_blank"><img class="icon" src="./img/yt-icon.png" /></a>'
        }
        if (track.spotify.items) {
            spotifyURL = '<a href="https://open.spotify.com/track/' + track.spotify.items[0].id + 'target="_blank"><img class="icon" src="./img/sp-icon.png" /></a>'
        }
        if (track.soundcloud.items) {
            soundcloudURL = '<a href="https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F' + track.soundcloud.items[0].id +'target="_blank"><img class="icon" src="/img/sc-icon.png" /></a>'
        }
        return {youtubeURL:youtubeURL, spotifyURL: spotifyURL, soundcloudURL: soundcloudURL}
    }
    function beforeSendAPI() {
        $('#track-list').empty();
        $('#track-list').html('<img id="loading" src="./img/Cube.gif">');

    }

    function handleSuccess(data) {
        $('#track-list').empty();
        $.each(data, function(i, item) {
            var urls = getURL(item)
            $('#track-list').append('<div class=track-container>\
                <div class="track-background" style="background-image:url('+ item.thumb +')"></div>\
                <div class="track-info">\
                    <b><h3>'+item.track_artist+'</h3></b>\
                    <h4>'+item.track_title+'</h4>\
                </div>\
                <div class="buttons">\
                '+urls.youtubeURL+''+urls.spotifyURL+''+urls.soundcloudURL+'\
                </div>\
                </div>'
            );
        })
    }

    function getPlays() {
        
        $.ajax({
            url: API_URL+'/user/getplays/?limit=10',
            dataType: 'json',
            method: 'POST',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            beforeSend: function() {
                beforeSendAPI();
                // checkLogin();
            },
            success: function(data, textStatus,jqXHR) {
                handleSuccess(data.items);
            }, 
            error: function(error) {
                if (error.status == 401) {
                    $("#track-list").html('<h2>Connect an account to get started!</h2><br >\
                    <a href="https://accounts.spotify.com/authorize/?client_id=84aa4ce44f674897949f684ffb2fa341&response_type=code&redirect_uri=http://trackpond.craigchisholm.me/connect/?source=spotify&scope=user-read-private%20user-read-email&state=spotify">\
                        <img src="./img/sp-icon.png" class="connect-icon" />\
                    </a>\
                    <a href="https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/youtube&access_type=offline&include_granted_scopes=true&redirect_uri=http://trackpond.craigchisholm.me/connect/?source=youtube&response_type=code&client_id=138806318897-10ab2q5qi8tq07nl6s3u050i7iq7hq91.apps.googleusercontent.com">\
                        <img src="./img/yt-icon.png" class="connect-icon" />\
                    </a>');
                }
            }
        });
    }

    function getTopTracks() {
        // xhr.abort()
        $.ajax({
            url: API_URL+'/tracks/toptracks/',
            dataType: 'json',
            method: 'POST',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            beforeSend: function() {
                beforeSendAPI();
            },
            success: function(data, textStatus,jqXHR) {
               handleSuccess(data.items);
            }
        });
    }

    $('#top-tracks').click(function () {
        getTopTracks()
    });
     $('#plays').click(function () {
        getPlays()
    });

    loadPage();

};