class Voca {
    constructor(eng, kor, pronounce, audioKey) {
        this.eng = eng;
        this.kor = kor;
        this.pronounce = pronounce;
        this.audioKey = audioKey
    }

    engHtml() {
        var result = this.eng

        if( this.pronounce ) {
            result += "<br>" + this.pronounce
        }

        if( this.audioKey ) {
            result += "<br> <audio controls autoplay id='pronounce' src='" + this.audioUrl() + "'>가능?</audio>"
        }

        return result
    }

    audioUrl() {
        return "http://t1.daumcdn.net/language/" + this.audioKey
    }
}


const vocas = [];
(function () {
    for (var i = 0; i < vocaDatas.length; i++) {
        var item = vocaDatas[i];
        vocas[i] = new Voca(item[0], item[1], item[2], item[3]);
    }
})()

var voca = null

var elQuestion
var elAnswer
var elStatus
var elSliderFrom
var elSliderFromValue
var elSliderTo
var elSliderToValue
var elSliderCurrent
var elSliderCurrentValue

var currentIndex = null
var randomIndex = null

var vocaGroupSize = 50

function onLoadBody() {
    cbKrToEn = document.getElementById("cbKrToEn");
    loadCheckboxStatus();
    loadVocaStatus();

    elQuestion = document.getElementById("question");
    elAnswer = document.getElementById("answer");
    elStatus = document.getElementById("status");

    elSliderFrom = document.getElementById("slider_voca_from");
    elSliderFromValue = document.getElementById("slider_voca_from_value");
    elSliderFromValue.innerText = elSliderFrom.value

    elSliderTo = document.getElementById("slider_voca_to");
    elSliderToValue = document.getElementById("slider_voca_to_value");
    elSliderToValue.innerText = elSliderTo.value * vocaGroupSize

    elSliderCurrent = document.getElementById("slider_voca_current");
    elSliderCurrentValue = document.getElementById("slider_voca_current_value");
    elSliderCurrentValue.innerText = elSliderCurrent.value

    elSliderFrom.oninput = function() {
        elSliderFromValue.innerText = (this.value * vocaGroupSize - vocaGroupSize + 1)
        if( new Number(elSliderFrom.value) > new Number(elSliderTo.value) ) {
            elSliderTo.value = this.value
            elSliderToValue.innerText = this.value * vocaGroupSize
        }
    }
    elSliderTo.oninput = function() {
        elSliderToValue.innerText = this.value * vocaGroupSize
        if( new Number(elSliderTo.value) < new Number(elSliderFrom.value) ) {
            elSliderFrom.value = this.value
            elSliderFromValue.innerText = (this.value * vocaGroupSize - vocaGroupSize + 1)
        }
    }
    elSliderCurrent.oninput = function() {
        elSliderCurrentValue.innerText = this.value
        currentIndex = new Number(this.value)
    }

    elSliderFrom.max = vocas.length / vocaGroupSize
    elSliderTo.max = Math.floor(vocas.length / vocaGroupSize)
    elSliderToValue.innerText = elSliderTo.max * vocaGroupSize
    elSliderCurrent.max = vocas.length

    elSliderTo.value = vocas.length - 1
}


var nextCount = 0
function next() {
    if( nextCount++ %2 == 0 ) { quiz() } else { answer() }
}
function audioPlay() {
    document.getElementById("pronounce").play()
}

function clear() {
    elQuestion.innerText=""
    elAnswer.innerText=""
    elStatus.innerText=""
}

function getNextVoca() {
    if( isNaN(currentIndex) ) {
        currentIndex = -1;
    }

    if( currentIndex < new Number(elSliderFromValue.innerText) - 1 || currentIndex >= new Number(elSliderToValue.innerText) - 1 ) {
        currentIndex = new Number(elSliderFromValue.innerText) - 1
    } else {
        currentIndex++
    }

    elSliderCurrent.value = (new Number(currentIndex) + 1)
    elSliderCurrentValue.innerText = (new Number(currentIndex) + 1)

	saveVocaStatus()
    return vocas[currentIndex];
}

function getRandomVoca() {
    randomRange = new Number(elSliderToValue.innerText) - new Number(elSliderFromValue.innerText)
    randomIndex = Math.ceil(Math.random() * randomRange) + new Number(elSliderFromValue.innerText) - 1

    elSliderCurrent.value = randomIndex
    elSliderCurrentValue.innerText = randomIndex
    return vocas[randomIndex];
}

function quiz() {
    clear()

    if(cbRandom.checked) {
        voca = getRandomVoca()
        elStatus.innerText = "Random: " + (new Number(randomIndex) + 1) + "/" + (vocas.length)
    } else {
        voca = getNextVoca()
        elStatus.innerText = "Sequential: " + (new Number(currentIndex) + 1) + "/" + (vocas.length)
    }

    if( cbKrToEn.checked ) {
        elQuestion.innerText = voca.kor
    } else {
        elQuestion.innerHTML = voca.engHtml()
    }
}

function answer() {
    if( cbKrToEn.checked ) {
        elAnswer.innerHTML = voca.engHtml()
    } else {
        elAnswer.innerText = voca.kor
    }
}

function loadVocaStatus() {
	currentIndex = eval(window.localStorage.getItem("currentIndex"))
	if( null == currentIndex ) { currentIndex = 0; }
}

function saveVocaStatus() {
    window.localStorage.setItem("currentIndex", currentIndex);
}

function onclickCheckbox(event) {
    saveCheckboxStatus();
    nextCount = 0
}

function loadCheckboxStatus() {
    if( null == window.localStorage.getItem("cbKrToEn") ) {
        cbKrToEn.checked = true;
    } else {
        cbKrToEn.checked = window.localStorage.getItem("cbKrToEn") == "true";
    }
    if( null == window.localStorage.getItem("cbRandom") ) {
        cbRandom.checked = false;
    } else {
        cbRandom.checked = window.localStorage.getItem("cbRandom") == "true";
    }
}

function saveCheckboxStatus() {
    window.localStorage.setItem("cbKrToEn", cbKrToEn.checked);
    window.localStorage.setItem("cbKrToEn", cbKrToEn.checked);
}
