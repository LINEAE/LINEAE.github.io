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

var currentIndex = null
var randomIndex = null

var vocaGroupSize = 50

function onLoadBody() {
    lsCheckVocaKrToEn = new LSCheckbox(checkbox_kr_to_en, "voca_kr_to_en", true)
    lsCheckVocaRandom = new LSCheckbox(checkbox_random, "vocal_random", false)
    loadVocaStatus();

    span_from.innerText = slider_from.value
    span_to.innerText = slider_to.value * vocaGroupSize
    span_current.innerText = slider_current.value

    slider_from.oninput = function() {
        span_from.innerText = (this.value * vocaGroupSize - vocaGroupSize + 1)
        if( new Number(slider_from.value) > new Number(slider_to.value) ) {
            slider_to.value = this.value
            span_to.innerText = this.value * vocaGroupSize
        }
    }
    slider_to.oninput = function() {
        span_to.innerText = this.value * vocaGroupSize
        if( new Number(slider_to.value) < new Number(slider_from.value) ) {
            slider_from.value = this.value
            span_from.innerText = (this.value * vocaGroupSize - vocaGroupSize + 1)
        }
    }
    slider_current.oninput = function() {
        span_current.innerText = this.value
        currentIndex = new Number(this.value)
    }

    slider_from.max = vocas.length / vocaGroupSize
    slider_to.max = Math.floor(vocas.length / vocaGroupSize)
    span_to.innerText = slider_to.max * vocaGroupSize
    slider_current.max = vocas.length

    slider_to.value = vocas.length - 1
}


var nextCount = 0
function next() {
    if( nextCount++ %2 == 0 ) { quiz() } else { answer() }
}
function audioPlay() {
    pronounce.play()
}

function clear() {
    div_question.innerText=""
    div_answer.innerText=""
    status.innerText=""
}

function getNextVoca() {
    if( isNaN(currentIndex) ) {
        currentIndex = -1;
    }

    if( currentIndex < new Number(span_from.innerText) - 1 || currentIndex >= new Number(span_to.innerText) - 1 ) {
        currentIndex = new Number(span_from.innerText) - 1
    } else {
        currentIndex++
    }

    slider_current.value = (new Number(currentIndex) + 1)
    span_current.innerText = (new Number(currentIndex) + 1)

	saveVocaStatus()
    return vocas[currentIndex];
}

function getRandomVoca() {
    randomRange = new Number(span_to.innerText) - new Number(span_from.innerText)
    randomIndex = Math.ceil(Math.random() * randomRange) + new Number(span_from.innerText) - 1

    slider_current.value = randomIndex
    span_current.innerText = randomIndex
    return vocas[randomIndex];
}

function quiz() {
    clear()

    if( lsCheckVocaRandom.checked() ) {
        voca = getRandomVoca()
        status.innerText = "Random: " + (new Number(randomIndex) + 1) + "/" + (vocas.length)
    } else {
        voca = getNextVoca()
        status.innerText = "Sequential: " + (new Number(currentIndex) + 1) + "/" + (vocas.length)
    }

    if( lsCheckVocaKrToEn.checked() ) {
        div_question.innerText = voca.kor
    } else {
        div_question.innerHTML = voca.engHtml()
    }
}

function answer() {
    if( checkbox_kr_to_en.checked ) {
        div_answer.innerHTML = voca.engHtml()
    } else {
        div_answer.innerText = voca.kor
    }
}

function loadVocaStatus() {
	currentIndex = eval(window.localStorage.getItem("currentIndex"))
	if( null == currentIndex ) { currentIndex = 0; }
}

function saveVocaStatus() {
    window.localStorage.setItem("currentIndex", currentIndex);
}

function onclickCheckbox() {
    lsCheckVocaKrToEn.save();
    lsCheckVocaRandom.save();
    nextCount = 0
}
