class Preposition {
    constructor(eng, subject, object, audioKey) {
        this.eng = eng;
        this.subject = subject;
        this.object = object;
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
        if( this.audioKey.startsWith("./") ) {
            return this.audioKey
        } else {
            return "http://t1.daumcdn.net/language/" + this.audioKey
        }
    }
}

const prepositions = [];
(function () {
    for (var i = 0; i < prepositionDatas.length; i++) {
        var item = prepositionDatas[i];
        prepositions[i] = new Preposition(item[0], item[1], item[2], item[3]);
    }
})()

var preposition = null

var elQuestion
var elAnswer
var elStatus
var elSliderCurrent
var elSliderCurrentValue

var currentIndex = null
var randomIndex = null
var intervalValue = null

function onLoadBody() {
    lsCheckPrepositionRandom = new LSCheckbox(document.getElementById("cbPrepositionRandom"), "cbPrepositionRandom", false)
    lsCheckPrepositionHideSubject = new LSCheckbox(document.getElementById("cbPrepositionHideSubject"), "cbPrepositionHideSubject", false)
    lsCheckPrepositionHideObject = new LSCheckbox(document.getElementById("cbPrepositionHideObject"), "cbPrepositionHideObject", false)
    loadCurrentStatus();

    elQuestion = document.getElementById("question");
    elAnswer = document.getElementById("answer");
    elStatus = document.getElementById("status");

    elSliderCurrent = document.getElementById("slider_preposition_current");
    elSliderCurrentValue = document.getElementById("slider_preposition_current_value");
    elSliderCurrent.value = currentIndex
    elSliderCurrentValue.innerText = elSliderCurrent.value

    elSliderCurrent.oninput = function() {
        elSliderCurrentValue.innerText = this.value
        currentIndex = new Number(this.value)
    }

    elSliderCurrent.max = prepositions.length

    elSliderInterval = document.getElementById("slider_preposition_interval");
    elSliderIntervalValue = document.getElementById("slider_preposition_interval_value");
    elSliderInterval.value = intervalValue
    elSliderIntervalValue.innerText = elSliderInterval.value

    elSliderInterval.oninput = function() {
        elSliderIntervalValue.innerText = this.value
        intervalValue = new Number(this.value)
    }
}


var nextCount = 0
function next() {
    if( nextCount++ %2 == 0 ) { quiz() } else { answer() }
}

var lastInterval = 0
function autoPlayCallback() {
    quiz()
    answer()
    if( intervalValue != lastInterval ) {
        autoPlay()
        autoPlay()
    }
}

var timerId = null
function autoPlay() {
    if( null == timerId ) {
        lastInterval = intervalValue
        timerId = setInterval(autoPlayCallback, intervalValue)
        btn_auto_play.innerText = "⏹"
    } else {
        clearInterval(timerId)
        timerId = null
        btn_auto_play.innerText = "🔄"
    }
}

function clear() {
    elQuestion.innerText=""
    elAnswer.innerText=""
    elStatus.innerText=""
}

function getNextPreposition() {
    if( isNaN(currentIndex) ) {
        currentIndex = 0;
    }

    elSliderCurrent.value = (new Number(currentIndex) + 1)
    elSliderCurrentValue.innerText = (new Number(currentIndex) + 1)

    var nextPreposition = prepositions[currentIndex];

    currentIndex = ++currentIndex % prepositions.length
	saveCurrentStatus()

    return nextPreposition
}

function getRandomPreposition() {
    randomIndex = Math.ceil(Math.random() * prepositions.length) - 1

    elSliderCurrent.value = randomIndex
    elSliderCurrentValue.innerText = randomIndex
    return prepositions[randomIndex];
}

function quiz() {
    clear()

    if( lsCheckPrepositionRandom.checked() ) {
        preposition = getRandomPreposition()
        elStatus.innerText = "Random: " + (new Number(randomIndex) + 1) + "/" + (prepositions.length)
    } else {
        preposition = getNextPreposition()
        elStatus.innerText = "Sequential: " + (new Number(currentIndex) + 1) + "/" + (prepositions.length)
    }

    if( null != timerId ) {
        elStatus.innerText += " [interval=" + lastInterval + "]"
    }

    elQuestion.innerHTML = preposition.engHtml()

    if( lsCheckPrepositionHideSubject.checked() && lsCheckPrepositionHideObject.checked() ) {
        next()
    }
}

function answer() {
    var result = ""

    if( !lsCheckPrepositionHideSubject.checked() ) {
        result += preposition.subject
    }

    if( !lsCheckPrepositionHideObject.checked() ) {
        if( result.length > 0 ) {
            result += "<br>"
        }
        result += preposition.object
    }

    if( result.length == 0 ) {
        result = "skip"
    }

    elAnswer.innerHTML = result
}

function loadCurrentStatus() {
	currentIndex = eval(window.localStorage.getItem("prepositionCurrentIndex"))
	if( null == currentIndex ) { currentIndex = 0; }

    intervalValue = eval(window.localStorage.getItem("prepositionIntervalValue"))
	if( null == intervalValue ) { intervalValue = 2000; }
}

function saveCurrentStatus() {
    window.localStorage.setItem("prepositionCurrentIndex", currentIndex);
    window.localStorage.setItem("prepositionIntervalValue", intervalValue);
}

function onclickCheckbox() {
    lsCheckPrepositionRandom.save();
    lsCheckPrepositionHideSubject.save();
    lsCheckPrepositionHideObject.save();
    nextCount = 0
}
