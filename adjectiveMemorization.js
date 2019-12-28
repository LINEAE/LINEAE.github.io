var adjective = null

var canvasWidth = 480;
var canvasHeight = 320;

var nextCount = 0
function next() {
    if( nextCount++ %2 == 0 ) {
        quiz()
    } else {
        answer()
    }
}

function quiz() {
    adjective = pickAdjective()

    drawCategory(adjective);
    if( cbKrToEn.checked ) {
        drawResultText(adjective);
    } else {
        drawQuizText(adjective);
    }

    var player = document.getElementById("audio-player")
    player.removeAttribute("src")
}

function answer() {
    if( cbKrToEn.checked ) {
        drawQuizText(adjective);
    } else {
        drawResultText(adjective);
    }
}

function playAudio() {
    var text = adjective.eng
    var player = document.getElementById("audio-player")
    
    if(player.src) {
        player.play()
    }else {
        playSpeechFromText(player, text)
    }

}

function pickAdjective() {
    var index = getRandomInt(0, adjectives.length);
    return adjectives[index];
}

function drawCategory(adjective) {
   var canvas = document.getElementById('text-layer');
    if (!canvas.getContext){
        return;
    }

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.font = '36px serif';
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.fillText(adjective.category, 70, 50, 340);
}

function drawQuizText(adjective) {
   var canvas = document.getElementById('text-layer');
    if (!canvas.getContext){
        return;
    }

    var ctx = canvas.getContext('2d');

    ctx.font = '36px serif';
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.fillText(adjective.eng, 70, 150, 340);
}

function drawResultText(adjective) {
   var canvas = document.getElementById('text-layer');
    if (!canvas.getContext){
        return;
    }

    var ctx = canvas.getContext('2d');
    ctx.font = '36px serif';
    ctx.strokeStyle = 'white';
    ctx.fillStyle = '#36A1D5';
    ctx.fillText(adjective.kor, 70, 250 , 340);
}


function onLoadBody() {
    loadCheckboxStatus();
}

window.onload = function() {
    cbKrToEn = document.getElementById("cbKrToEn");
}

function onclickCheckbox(event) {
    saveCheckboxStatus();
}

function loadCheckboxStatus() {
    if( null == window.localStorage.getItem("cbKrToEn") ) {
        cbKrToEn.checked = true;
    } else {
        cbKrToEn.checked = window.localStorage.getItem("cbKrToEn") == "true";
    }
}

function saveCheckboxStatus() {
    window.localStorage.setItem("cbKrToEn", cbKrToEn.checked);
}