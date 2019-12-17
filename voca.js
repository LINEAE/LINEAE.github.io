class Voca {
    constructor(eng, kor) {
        this.eng = eng;
        this.kor = kor;
    }
}

const vocas = [];
(function () {
    for (var i = 0; i < vocaDatas.length; i++) {
        var item = vocaDatas[i];
        vocas[i] = new Voca(item[0], item[1]);
    }
})()

var voca = null

var elQuestion
var elAnswer
var elStatus

var currentIndex = null
var randomIndex = null

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
    currentIndex = (currentIndex + 1) % vocas.length
	saveVocaStatus()
    return vocas[currentIndex];
}

function getRandomVoca() {
    randomIndex = Math.ceil(Math.random() * vocas.length)
    return vocas[randomIndex];
}

function quiz() {
    clear()

    if(cbRandom.checked) {
        voca = getRandomVoca()
        elStatus.innerText = "Random: " + randomIndex + "/" + vocas.length
    } else {
        voca = getNextVoca()
        elStatus.innerText = "Sequential: " + currentIndex + "/" + vocas.length
    }

    if( cbKrToEn.checked ) {
        elQuestion.innerText = voca.kor
    } else {
        elQuestion.innerText = voca.eng
    }
}

function answer() {
    if( cbKrToEn.checked ) {
        elAnswer.innerText = voca.eng
    } else {
        elAnswer.innerText = voca.kor
    }
}

function onLoadBody() {
    cbKrToEn = document.getElementById("cbKrToEn");
    loadCheckboxStatus();
    loadVocaStatus();

    elQuestion = document.getElementById("question");
    elAnswer = document.getElementById("answer");
    elStatus = document.getElementById("status");
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