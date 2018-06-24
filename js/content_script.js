var s = document.createElement('script');
s.src = chrome.extension.getURL('js/get_response.js');
s.onload = function() {
    this.remove();
};

(document.body).appendChild(s);

window.addEventListener('message', function(event) {
  // Only accept messages from same frame
  if (event.source !== window) {
    return;
  }

  var message = event.data;

  chrome.runtime.sendMessage(message);
});