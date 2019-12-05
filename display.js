var subject = null
var verb = null
var tense = null

var yPos = 125;
var circleWidth = 70;
var lineLength = 70;
var strokeWidth = 6;

function quiz() {
    subject = pickSubject();
    verb = pickVerb()
    tense = pickTense();

    console.log(subject+
        "\n" + verb +
        "\n" + tense +
        "\n" + getResult(subject,verb,tense))
        drawTense(tense.tense,tense.progressive, tense.perfect);
        drawQuizText(subject, verb);
}

function answer() {
   drawResultText(subject,verb,tense);
}

var nextCount = 0
function next() {
    if( nextCount++ %2 == 0 ) {
        quiz()
    } else {
        answer()
    }
}

function drawQuizText(subject, verb) {
   var canvas = document.getElementById('text-layer');
    if (!canvas.getContext){
        return;
    }

    var ctx = canvas.getContext('2d');
    ctx.font = '36px serif';
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';
    ctx.clearRect(0, 0, 480,320);

    ctx.fillText(subject.name, 70, 50);

    ctx.fillText(verb.base, 270, 50);

}

function drawResultText(subject, verb, tense) {
   var canvas = document.getElementById('text-layer');
    if (!canvas.getContext){
        return;
    }

    var ctx = canvas.getContext('2d');
    ctx.font = '36px serif';
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';


    ctx.fillText(getResult(subject,verb,tense), 70, 250);
    ctx.font = '30px serif';
    ctx.fillText(verb.kor, 150, 290);

}


function drawBackground(){
    var canvas = document.getElementById('background-layer');
    if (!canvas.getContext){
        return;
    }
    var presentPosX = (480 - circleWidth) / 2
    var pastPosX = presentPosX - lineLength - circleWidth
    var futurePosX = presentPosX + circleWidth + lineLength

    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'skyBlue';
    ctx.lineWidth = strokeWidth;

    drawCircle(ctx,pastPosX, yPos, circleWidth);
    drawCircle(ctx,presentPosX, yPos, circleWidth);
    drawCircle(ctx,futurePosX, yPos, circleWidth);

    drawHorizontalLine(ctx, pastPosX - lineLength, yPos + (circleWidth/2), lineLength)
    drawHorizontalLine(ctx, presentPosX - lineLength, yPos + (circleWidth/2), lineLength)
    drawHorizontalLine(ctx, futurePosX - lineLength, yPos + (circleWidth/2), lineLength)
    drawHorizontalLine(ctx, futurePosX + circleWidth, yPos + (circleWidth/2), lineLength)
}

function drawPast() {
    drawTense(TenseEnum.past, document.getElementById("progressive").checked, document.getElementById("perfect").checked)
}

function drawPresent() {
    drawTense(TenseEnum.present, document.getElementById("progressive").checked, document.getElementById("perfect").checked)
}

function drawFuture() {
    drawTense(TenseEnum.future, document.getElementById("progressive").checked, document.getElementById("perfect").checked)
}

function drawTense(tense, progressive, perfect) {
    var canvas = document.getElementById('ui-layer');
    if (!canvas.getContext){
        return;
    }
    var presentPosX = (480 - circleWidth) / 2
    var pastPosX = presentPosX - lineLength - circleWidth
    var futurePosX = presentPosX + circleWidth + lineLength

    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'blue';
    ctx.fillStyle = 'blue';
    ctx.lineWidth = strokeWidth;

    ctx.clearRect(0, 0, 480,320);

    //draw tense circle
    var xPos = presentPosX;
    switch(tense) {
        case TenseEnum.past:
            xPos = pastPosX;
            break;
        case TenseEnum.present:
            xPos = presentPosX;
            break;
        case TenseEnum.future:
            xPos = futurePosX;
            break;
    }
    drawCircle(ctx,xPos, yPos, circleWidth);

    //draw progressive
    if(progressive) {
        fillCircle(ctx,xPos, yPos, circleWidth);
    }

    //draw perfect
    if(perfect) {
        drawHorizontalLine(ctx, xPos - lineLength, yPos + (circleWidth/2), lineLength)
        drawVerticalLine(ctx, xPos, yPos, circleWidth)
    }
}

function drawHorizontalLine(ctx, startX, startY, length) {
    ctx.beginPath();
    ctx.moveTo(startX,startY);
    ctx.lineTo(startX + length, startY);
    ctx.stroke();
}

function drawVerticalLine(ctx, startX, startY, length) {
    ctx.beginPath();
    ctx.moveTo(startX,startY);
    ctx.lineTo(startX , startY + length);
    ctx.stroke();
}

function drawCircle(ctx, x, y, radiusX2) {
    var radius = radiusX2 / 2;
    var circle = new Path2D();
    circle.arc(x + radius, y + radius, radius, 0,  2 * Math.PI);
    ctx.stroke(circle);
}

function fillCircle(ctx, x, y, radiusX2) {
    var radius = radiusX2 / 2;
    var circle = new Path2D();
    circle.arc(x + radius, y + radius, radius, 0,  2 * Math.PI);
    ctx.fill(circle);
}