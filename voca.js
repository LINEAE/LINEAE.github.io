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

var currentIndex = null

var nextCount = 0
function next() {
    if( nextCount++ %2 == 0 ) { quiz() } else { answer() }
}

function clear() {
    elQuestion.innerText=""
    elAnswer.innerText=""
}

function getNextVoca() {
    currentIndex = (currentIndex + 1) % vocas.length
	saveVocaStatus()
    return vocas[currentIndex];
}

function quiz() {
    voca = getNextVoca()

    clear()
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
}

function saveCheckboxStatus() {
    window.localStorage.setItem("cbKrToEn", cbKrToEn.checked);
}