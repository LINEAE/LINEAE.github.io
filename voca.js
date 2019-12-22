class Voca {
    constructor(eng, kor, pronounce, url) {
        this.eng = eng;
        this.kor = kor;
        this.pronounce = pronounce;
        this.url = url;
    }

    engHtml() {
        var result = this.eng

        if( this.pronounce ) {
            result += "<br>" + this.pronounce
        }

        if( this.url ) {
            result += "<br> <audio controls autoplay src='" + this.url + "'>가능?</audio>"
        }

        return result
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
    elSliderToValue.innerText = elSliderTo.value

    elSliderCurrent = document.getElementById("slider_voca_current");
    elSliderCurrentValue = document.getElementById("slider_voca_current_value");
    elSliderCurrentValue.innerText = elSliderCurrent.value

    elSliderFrom.oninput = function() {
        elSliderFromValue.innerText = this.value
        if( new Number(elSliderFrom.value) > new Number(elSliderTo.value) ) {
            elSliderTo.value = this.value
            elSliderToValue.innerText = this.value
        }
    }
    elSliderTo.oninput = function() {
        elSliderToValue.innerText = this.value
        if( new Number(elSliderTo.value) < new Number(elSliderFrom.value) ) {
            elSliderFrom.value = this.value
            elSliderFromValue.innerText = this.value
        }
    }
    elSliderCurrent.oninput = function() {
        elSliderCurrentValue.innerText = this.value
    }

    elSliderFrom.max = vocas.length - 1
    elSliderTo.max = vocas.length - 1
    elSliderToValue.innerText = vocas.length - 1
    elSliderCurrent.max = vocas.length - 1

    elSliderTo.value = vocas.length
}


var nextCount = 0
function next() {
    if( nextCount++ %2 == 0 ) { quiz() } else { answer() }
}

function clear() {
    elQuestion.innerText=""
    elAnswer.innerText=""
    elStatus.innerText=""
}

function getNextVoca() {
    if( isNaN(currentIndex) ) {
        currentIndex = 0;
    }

    if( currentIndex < elSliderFrom.value || currentIndex >= elSliderTo.value ) {
        currentIndex = elSliderFrom.value
    } else {
        currentIndex++
    }

    elSliderCurrent.value = currentIndex
    elSliderCurrentValue.innerText = currentIndex

	saveVocaStatus()
    return vocas[currentIndex];
}

function getRandomVoca() {
    randomRange = elSliderTo.value - elSliderFrom.value
    randomIndex = Math.ceil(Math.random() * randomRange) + new Number(elSliderFrom.value)

    elSliderCurrent.value = randomIndex
    elSliderCurrentValue.innerText = randomIndex
    return vocas[randomIndex];
}

function quiz() {
    clear()

    if(cbRandom.checked) {
        voca = getRandomVoca()
        elStatus.innerText = "Random: " + randomIndex + "/" + (vocas.length - 1)
    } else {
        voca = getNextVoca()
        elStatus.innerText = "Sequential: " + currentIndex + "/" + (vocas.length - 1)
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