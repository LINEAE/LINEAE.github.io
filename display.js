var subject = null
var verb = null
var tense = null


var canvasWidth = 480;
var canvasHeight = 320;

var yPos = 124;
var circleWidth = 72;
var lineLength = 72;
var strokeWidth = 6;


function initCanvasSize(canvas) {
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    circleWidth = Math.floor(canvasWidth * 0.15);
    lineLength = circleWidth;

    yPos = Math.floor((canvasHeight - circleWidth) * 0.5);

    console.log("initCanvasSize: canvas:(" + canvasWidth +"," + canvasHeight + ") "
            + "circleWidth:" + circleWidth +" yPos:" + yPos);

}

function drawBackground(){
    var canvas = document.getElementById('background-layer');

    initCanvasSize(canvas);

    if (!canvas.getContext){
        return;
    }
    var presentPosX = (canvasWidth - circleWidth) / 2
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

function drawTense(tense, progressive, perfect) {
    var canvas = document.getElementById('ui-layer');
    if (!canvas.getContext){
        return;
    }
    var presentPosX = (canvasWidth - circleWidth) / 2
    var pastPosX = presentPosX - lineLength - circleWidth
    var futurePosX = presentPosX + circleWidth + lineLength

    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'blue';
    ctx.fillStyle = 'blue';
    ctx.lineWidth = strokeWidth;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

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

    if(!perfect) {
        drawCircle(ctx,xPos, yPos, circleWidth);
    }

    //draw progressive
    if(progressive) {
        drawCircle(ctx,xPos, yPos, circleWidth);
        fillCircle(ctx,xPos, yPos, circleWidth);
    }

    //draw perfect
    if(perfect) {
        drawHorizontalLine(ctx, xPos - lineLength, yPos + (circleWidth/2), lineLength)
        drawVerticalLine(ctx, xPos, yPos, circleWidth)
    }
}
