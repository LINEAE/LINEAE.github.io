var tense = null


var nextCount = 0
var strokeWidth = 3;
var colorTenseBg = 'skyBlue'
var colorTenseQuestion = 'red'

class ArticleWithTense{
    constructor(article, tense) {
        this.article = article;
        this.tense = tense;
    }
}


var items = articles
var item = null
var groupSize = 50

function onLoadBody() {
    drawBackground();
    lsCheckVocaKrToEn = new LSCheckbox(checkbox_kr_to_en, "voca_kr_to_en", true)
    lsCheckVocaRandom = new LSCheckbox(checkbox_random, "voca_random", false)
    lsCheckVocaPlaySound = new LSCheckbox(checkbox_play_sound, "voca_play_sound", true)
    lsFromIndex = new LSValue("voca_group_from_index", 1)
    lsToIndex = new LSValue("voca_group_to_index", 1)
    loadStatus();

    span_from.innerText = slider_from.value
    span_to.innerText = slider_to.value * groupSize
    span_current.innerText = slider_current.value

    slider_from.oninput = function () {
        span_from.innerText = (this.value * groupSize - groupSize + 1)
        if (new Number(slider_from.value) > new Number(slider_to.value)) {
            slider_to.value = this.value
            span_to.innerText = this.value * groupSize
            lsToIndex.setValue(this.value)
        }
        lsFromIndex.setValue(this.value)
    }
    slider_to.oninput = function () {
        span_to.innerText = this.value * groupSize
        if (new Number(slider_to.value) < new Number(slider_from.value)) {
            slider_from.value = this.value
            span_from.innerText = (this.value * groupSize - groupSize + 1)
            lsFromIndex.setValue(this.value)
        }
        lsToIndex.setValue(this.value)
    }
    slider_current.oninput = function () {
        span_current.innerText = this.value
        currentIndex = new Number(this.value)
    }

    slider_from.max = items.length / groupSize
    slider_to.max = Math.floor(items.length / groupSize)
    slider_current.max = items.length

    slider_from.value = lsFromIndex.getEval()
    slider_from.oninput()
    slider_to.value = lsToIndex.getEval()
    slider_to.oninput()
}

function loadStatus() {
    currentIndex = eval(window.localStorage.getItem("currentIndex_article"))
    if (null == currentIndex) { currentIndex = 0; }
}

function saveStatus() {
    window.localStorage.setItem("currentIndex_article", currentIndex);
}

function onclickCheckbox() {
    lsCheckVocaKrToEn.save();
    lsCheckVocaRandom.save();
    lsCheckVocaPlaySound.save();
    nextCount = 0
}

var currentIndex = null
function getNext() {
    if (isNaN(currentIndex)) {
        currentIndex = -1;
    }

    if (currentIndex < new Number(span_from.innerText) - 1 || currentIndex >= new Number(span_to.innerText) - 1) {
        currentIndex = new Number(span_from.innerText) - 1
    } else {
        currentIndex++
    }

    slider_current.value = (new Number(currentIndex) + 1)
    span_current.innerText = (new Number(currentIndex) + 1)

    saveStatus()
    return items[currentIndex];
}

var randomStartIndex = 0
var randomEndIndex = 0
var randomQuizSlot = []
function getRandom() {
    var currentRandomStartIndex = eval(span_from.innerText)
    var currentRandomEndIndex = eval(span_to.innerText)
    if (randomStartIndex == currentRandomStartIndex && randomEndIndex == currentRandomEndIndex) {
        if (randomQuizSlot.length == 0) {
            refill()
        }
    } else {
        randomStartIndex = currentRandomStartIndex
        randomEndIndex = currentRandomEndIndex

        refill()
    }

    var randomIndex = randomQuizSlot.pop()
    slider_current.value = (new Number(randomIndex) + 1)
    span_current.innerText = (new Number(randomIndex) + 1)

    return items[randomIndex]
}

function refill() {
    randomQuizSlot = []
    for (var i = randomStartIndex; i <= randomEndIndex; i++) {
        randomQuizSlot.push(eval(i))
    }
    shuffle(randomQuizSlot)
    log("Random slot refilled " + randomQuizSlot)
}

function audioPlay() {
    //pronounce.play()
    currentIndex = -1
}

function next() {
    if( nextCount++ %2 == 0 ) {
        quiz()
    } else {
        answer()
    }
}

function quiz() {
    tense = pickTense()
    
    if (lsCheckVocaRandom.checked()) {
        item = getRandom()
        div_status.innerText = "Random: " + randomStartIndex + "~" + randomEndIndex + ", remains:" + (randomQuizSlot.length)
    } else {
        item = getNext()
        div_status.innerText = "Sequential: " + (new Number(currentIndex) + 1) + "/" + (items.length)
    }

    drawTense(tense.tense, tense.progressive, tense.perfect);
    drawArticle(item.index);
    writeArticle("");
}

function answer() {
    writeArticle(item.description);
}


function pickTense() {
    var index = getRandomInt(0, tenses.length);
    return tenses[index];
}


function drawArticle(index) {
    var img = document.getElementById("article-image");
    img.src = "res/imageArticleResized/" + index + ".jpg";
}

function writeArticle(description) {
    var textView = document.getElementById("article-text-description");
    textView.innerText = description;

}
