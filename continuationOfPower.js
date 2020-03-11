
class Power {
    constructor(index, question,answer) {
        this.index = index;
        this.question = question;
        this.answer = answer;
    }
}

const powers = [];
(function () {
    for (var i = 0; i < powerData.length; i++) {
        var item = powerData[i];
        powers[i] = new Power(i + 1, item[0], item[1]);
    }
})()


var nextCount = 0
var items = powers
var item = null
var groupSize = 100

function onLoadBody() {
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
    currentIndex = eval(window.localStorage.getItem("currentIndex_power"))
    if (null == currentIndex) { currentIndex = 0; }
}

function saveStatus() {
    window.localStorage.setItem("currentIndex_power", currentIndex);
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

    if (lsCheckVocaRandom.checked()) {
        item = getRandom()
        div_status.innerText = "Random: " + randomStartIndex + "~" + randomEndIndex + ", remains:" + (randomQuizSlot.length)
    } else {
        item = getNext()
        div_status.innerText = "Sequential: " + (new Number(currentIndex) + 1) + "/" + (items.length)
    }

   
    drawImage(item.index);
    writeQuestion(item.question);
    writeAnswer("");
}

function answer() {
    writeAnswer(item.answer);
}


function drawImage(index) {
    var img = document.getElementById("power-image");
    img.src = "res/power/" + index + ".png";
}

function writeQuestion(question) {
    var textView = document.getElementById("power-question");
    textView.innerText = question;
}

function writeAnswer(answer) {
    var textView = document.getElementById("power-answer");
    textView.innerText = answer;
}