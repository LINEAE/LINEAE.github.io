function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

function shuffle(array) {
    var j, x, i;
    for (i = array.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = array[i - 1];
        array[i - 1] = array[j];
        array[j] = x;
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

function drawX(ctx, x, y, size) {
    var path = new Path2D();
    path.moveTo(x,y)
    path.lineTo(x + size, y + size)
    path.moveTo(x + size, y)
    path.lineTo(x, y + size)
    ctx.stroke(path);
}

function fillCircle(ctx, x, y, radiusX2) {
    var radius = radiusX2 / 2;
    var circle = new Path2D();
    circle.arc(x + radius, y + radius, radius, 0,  2 * Math.PI);
    ctx.fill(circle);
}

function capitialize(msg) {
    if(msg.length == 0) {
        return "";
    }else if(msg.length == 1) {
        return msg.charAt(0).toUpperCase();
    } else {
        return msg.charAt(0).toUpperCase() + msg.slice(1)
    }
}