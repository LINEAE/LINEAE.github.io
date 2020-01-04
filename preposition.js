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

var intervalValue = null

function onLoadBody() {
    lsCheckPrepositionRandom = new LSCheckbox(checkbox_random, "cbPrepositionRandom", false)
    lsCheckPrepositionHideSubject = new LSCheckbox(checkbox_hide_subject, "cbPrepositionHideSubject", false)
    lsCheckPrepositionHideObject = new LSCheckbox(checkbox_hide_object, "cbPrepositionHideObject", false)
    loadCurrentStatus();

    slider_current.value = currentIndex
    span_current.innerText = slider_current.value

    slider_current.oninput = function() {
        span_current.innerText = this.value
        currentIndex = new Number(this.value)
    }

    slider_current.max = prepositions.length

    slider_interval.value = intervalValue
    span_interval.innerText = slider_interval.value

    slider_interval.oninput = function() {
        span_interval.innerText = this.value
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
    div_question.innerText=""
    div_answer.innerText=""
    div_status.innerText=""
}

var currentIndex = null
function getNextPreposition() {
    if( isNaN(currentIndex) ) {
        currentIndex = 0;
    }

    slider_current.value = (new Number(currentIndex) + 1)
    span_current.innerText = (new Number(currentIndex) + 1)

    var nextPreposition = prepositions[currentIndex];

    currentIndex = ++currentIndex % prepositions.length
	saveCurrentStatus()

    return nextPreposition
}

var randomQuizSlot = []
function getRandomPreposition() {
    if( randomQuizSlot.length == 0 ) {
        randomQuizSlot = prepositions.slice()
        shuffle(randomQuizSlot)
    }

    return randomQuizSlot.pop()
}

function quiz() {
    clear()

    if( lsCheckPrepositionRandom.checked() ) {
        preposition = getRandomPreposition()
        div_status.innerText = "Random: remains: " + randomQuizSlot.length + "/" + prepositions.length
    } else {
        preposition = getNextPreposition()
        div_status.innerText = "Sequential: " + (new Number(currentIndex) + 1) + "/" + (prepositions.length)
    }

    if( null != timerId ) {
        div_status.innerText += " [interval=" + lastInterval + "]"
    }

    div_question.innerHTML = preposition.engHtml()

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

    div_answer.innerHTML = result
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
