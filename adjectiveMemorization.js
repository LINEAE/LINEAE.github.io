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
   
    drawQuizText(adjective);
}

function answer() {
    drawResultText(adjective)
}

function onLoadBody() {
}


function pickAdjective() {
    var index = getRandomInt(0, adjectives.length);
    return adjectives[index];
}

function drawQuizText(adjective) {
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