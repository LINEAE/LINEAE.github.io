var tense = null
var article = null

var nextCount = 0
var strokeWidth = 3;
var colorTenseBg = 'skyBlue'
var colorTenseQuestion = 'red'

function next() {
    if( nextCount++ %2 == 0 ) {
        quiz()
    } else {
        answer()
    }
}

function quiz() {
    tense = pickTense()
    article = pickArticle()

    drawTense(tense.tense, tense.progressive, tense.perfect);
    drawArticle(article.index);
    writeArticle("");
}

function answer() {
    writeArticle(article.description);
}

function onLoadBody() {
    drawBackground();
}


function pickTense() {
    var index = getRandomInt(0, tenses.length);
    return tenses[index];
}

function pickArticle() {
    var index = getRandomInt(0, articles.length);
    return articles[index];
}

function drawArticle(index) {
    var img = document.getElementById("article-image");
    img.src = "res/imageArticleResized/" + index + ".jpg";
}

function writeArticle(description) {
    var textView = document.getElementById("article-text-description");
    textView.value = description;

}
