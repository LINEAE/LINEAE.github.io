function next() {
    var tense = pickTense()
    var image = pickImage()

    drawTense(tense.tense, tense.progressive, tense.perfect)
    drawImage(image)
}


function onLoadBody() {
    drawBackground();
}


function pickTense() {
    var index = getRandomInt(0, tenses.length);
    return tenses[index];
}

function pickImage() {
    return getRandomInt(1, 33);
}

function drawImage(image) {
    var img = document.getElementById("article-image");
    img.src = "res/imageArticle/" + image + ".jpg";
}