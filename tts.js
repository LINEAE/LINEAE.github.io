
const apiHost = "https://lineae.azurewebsites.net"

function playSpeechFromText(player, text) {
    
    var encodedText = encodeURI(text);
    var request = new XMLHttpRequest()
    request.withCredentials = true
    request.open('GET', apiHost + "/api/tts/" + encodedText, true)    
    request.onreadystatechange = function () {
      if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
        var audio = apiHost + "/cache/" + request.responseText;
        console.log("playSpeechFromText audio:" + audio);
        player.src = audio;
        player.play();
      }
    };
 
    request.send(null);

}