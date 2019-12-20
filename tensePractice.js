
var subject = null
var verb = null
var tense = null
var positive = true
function quiz() {
    subject = pickSubject();
    verb = pickVerb()
    tense = pickTense();
    positive = pickPositive();

    console.log(subject+
        "\n" + verb +
        "\n" + tense +
        "\n" + positive +
        "\n" + getResult(subject,verb,tense,positive))
    drawTense(tense.tense,tense.progressive, tense.perfect);
    drawQuiz(subject, verb, positive);
}

function answer() {
   drawResultText(subject,verb,tense, positive);
}

var nextCount = 0
function next() {
    if( nextCount++ %2 == 0 ) {
        quiz()
    } else {
        answer()
    }
}

function drawQuiz(subject, verb, positive) {
   var canvas = document.getElementById('text-layer');
    if (!canvas.getContext){
        return;
    }

    var ctx = canvas.getContext('2d');
    ctx.font = '36px serif';
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillText(subject.name, 70, 50);

    ctx.fillText(verb.base, 270, 50);
    ctx.font = '20px serif';
    ctx.fillText(verb.kor, 270, 80 , 200);

    if(positive == false) {
        ctx.strokeStyle = 'red'
        ctx.lineWidth = strokeWidth;
        drawX(ctx, 170, 20,50);
    }

}

function drawResultText(subject, verb, tense, positive) {
   var canvas = document.getElementById('text-layer');
    if (!canvas.getContext){
        return;
    }

    var ctx = canvas.getContext('2d');
    ctx.font = '36px serif';
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.fillText(getResult(subject,verb,tense, positive), 70, 250 , 340);

    ctx.fillStyle = '#36A1D5';
    ctx.fillText(verb.base + " - " + verb.past + " - " + verb.perfect, 70, 290 , 340);
}


function pickSubject() {
    var index = getRandomInt(0, subjects.length);
    return subjects[index];
}

function pickTense() {
    var arTense = []
    if(cbPresent.checked == false && cbPast.checked == false && cbFuture.checked == false) {
        arTense.push(TenseEnum.present)
        arTense.push(TenseEnum.past)
        arTense.push(TenseEnum.future)
    }
    else {
        if(cbPresent.checked) { arTense.push(TenseEnum.present) }
        if(cbPast.checked) { arTense.push(TenseEnum.past) }
        if(cbFuture.checked) { arTense.push(TenseEnum.future) }
    }
    shuffle(arTense)

    var progressive = false
    if(cbProgressive.checked == cbNotProgressive.checked) {
        progressive = Math.floor(Math.random() * 2) == 0
    } else {
        progressive = cbProgressive.checked;
    }

    var perfect = false
    if(cbPerfect.checked == cbNotPerfect.checked) {
        perfect = Math.floor(Math.random() * 2) == 0
    } else {
        perfect = cbPerfect.checked;
    }

    return new Tense(arTense[0], progressive, perfect)
}

function pickVerb() {
    var index = getRandomInt(0, verbs.length);
    return verbs[index];
}

function pickPositive() {
    var positive = true
    if(cbPositive.checked == cbNegative.checked) {
        positive = Math.floor(Math.random() * 2) == 0
    } else {
        positive = cbPositive.checked;
    }    
    return positive
}

function getResult(subject, verb, tense, positive) {
    var name = subject.name;

    var displayTense = tense.getDisplayTense(subject, positive);
    var displayVerb = verb.getDisplayVerb(subject, tense, positive);
    

    return capitialize(name + displayTense + displayVerb);
}

function onLoadBody() {
    drawBackground();
    loadCheckboxStatus();
}

window.onload = function() {
    cbPast = document.getElementById("cbPast");
    cbPresent = document.getElementById("cbPresent");
    cbFuture = document.getElementById("cbFuture");

    cbProgressive = document.getElementById("cbProgressive");
    cbNotProgressive = document.getElementById("cbNotProgressive");
    cbPerfect = document.getElementById("cbPerfect");
    cbNotPerfect = document.getElementById("cbNotPerfect");

    cbPositive = document.getElementById("cbPositive");
    cbNegative = document.getElementById("cbNegative");
}

function onclickCheckbox(event) {
    saveCheckboxStatus();
}

function loadCheckboxStatus() {
    if( null == window.localStorage.getItem("cbPast") ) {
        cbPast.checked = true;
    } else {
        cbPast.checked = window.localStorage.getItem("cbPast") == "true";
    }

    if( null == window.localStorage.getItem("cbPresent") ) {
        cbPresent.checked = true;
    } else {
        cbPresent.checked = window.localStorage.getItem("cbPresent") == "true";
    }

    if( null == window.localStorage.getItem("cbFuture") ) {
        cbFuture.checked = true;
    } else {
        cbFuture.checked = window.localStorage.getItem("cbFuture") == "true";
    }

    if( null == window.localStorage.getItem("cbProgressive") ) {
        cbProgressive.checked = true;
    } else {
        cbProgressive.checked = window.localStorage.getItem("cbProgressive") == "true";
    }

    if( null == window.localStorage.getItem("cbNotProgressive") ) {
        cbNotProgressive.checked = true;
    } else {
        cbNotProgressive.checked = window.localStorage.getItem("cbNotProgressive") == "true";
    }

    if( null == window.localStorage.getItem("cbPerfect") ) {
        cbPerfect.checked = true;
    } else {
        cbPerfect.checked = window.localStorage.getItem("cbPerfect") == "true";
    }

    if( null == window.localStorage.getItem("cbNotPerfect") ) {
        cbNotPerfect.checked = true;
    } else {
        cbNotPerfect.checked = window.localStorage.getItem("cbNotPerfect") == "true";
    }

    if( null == window.localStorage.getItem("cbPositive") ) {
        cbPositive.checked = true;
    } else {
        cbPositive.checked = window.localStorage.getItem("cbPositive") == "true";
    }

    if( null == window.localStorage.getItem("cbNegative") ) {
        cbNegative.checked = true;
    } else {
        cbNegative.checked = window.localStorage.getItem("cbNegative") == "true";
    }
}

function saveCheckboxStatus() {
    window.localStorage.setItem("cbPast", cbPast.checked);
    window.localStorage.setItem("cbPresent", cbPresent.checked);
    window.localStorage.setItem("cbFuture", cbFuture.checked);
    window.localStorage.setItem("cbProgressive", cbProgressive.checked);
    window.localStorage.setItem("cbNotProgressive", cbNotProgressive.checked);
    window.localStorage.setItem("cbPerfect", cbPerfect.checked);
    window.localStorage.setItem("cbNotPerfect", cbNotPerfect.checked);
    window.localStorage.setItem("cbPositive", cbPositive.checked);
    window.localStorage.setItem("cbNegative", cbNegative.checked);
}
