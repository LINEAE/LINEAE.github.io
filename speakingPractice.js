
var subject = null
var useBe = false
var tense = null
var positive = true
var ask = false

var see = new Verb("see", "saw", "seen", "seeing", "보다", "")
var movie = "the movie";

var teacher = [
    new Subject("a teacher", PersonEnum.third, PluralEnum.singular),
    new Subject("teachers", PersonEnum.third, PluralEnum.plural),
]

function getTeacher(plural) {
    if(plural == PluralEnum.singular) {
        return teacher[0].name;
    } else {
        return teacher[1].name;
    }
}

function quiz() {
    subject = pickSubject();
    useBe = pickUseBe()
    tense = pickTense();
    positive = pickPositive();
    ask = pickAsk();

    console.log(subject+
        "\n" + useBe +
        "\n" + tense +
        "\n" + positive +
        "\n" + ask +
        "\n" + getResult(subject,useBe,tense,positive, ask))
    drawTense(tense.tense,tense.progressive, tense.perfect);
    drawQuiz(subject, useBe, positive, ask);
    setAudioPlayButtonVisible(false);
}

function answer() {
   drawResultText(subject,useBe,tense, positive, ask);
   setAudioPlayButtonVisible(true);
}

function playAudio() {
    var text = getResult(subject,useBe ,tense, positive, ask)
    var encodedText = encodeURI(text);
    var request = new XMLHttpRequest()
    request.withCredentials = true
    request.open('GET', "https://lineae.azurewebsites.net/api/tts/" + encodedText, true)    
    request.onreadystatechange = function () {
      if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
        var audio = "https://lineae.azurewebsites.net/" + request.responseText;
        console.log("playAudio audio:" + audio);
        var player = ocument.getElementById("audio-player")
        player.src = audio;
        player.play();
      }
    };
 
    request.send(null);

}

var nextCount = 0
function next() {
    if( nextCount++ %2 == 0 ) {
        quiz()
    } else {
        answer()
    }
}


function setAudioPlayButtonVisible(visible) {
    if(visible) {
        document.getElementById("audio-layer").style.display="block";
    } else {
        document.getElementById("audio-layer").style.display="none";
    }
}

function drawQuiz(subject, useBe, positive, ask) {
   var canvas = document.getElementById('text-layer');
    if (!canvas.getContext){
        return;
    }

    var ctx = canvas.getContext('2d');
    ctx.font = '36px serif';
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    

    if(useBe) {
        ctx.fillText(getTeacher(subject.plural), 230, 50, 180);
    }else {
        ctx.fillText(see.base + " " + movie, 230, 50, 180);
    }
    
    var nameX = 70;
    if(ask) {       
        ctx.strokeStyle = 'orange'
        ctx.lineWidth = strokeWidth;
        drawAsk(ctx, 70,25,30);
        nameX += 40;
        
        if(positive == false) {
            ctx.strokeStyle = 'red'
            ctx.lineWidth = strokeWidth;
            drawX(ctx, nameX,25,30);

            nameX += 40;
        }
    } else {        
        if(positive == false) {
            ctx.strokeStyle = 'red'
            ctx.lineWidth = strokeWidth;
            drawX(ctx, 170,25,30);
        }
    }

    ctx.fillText(subject.name, nameX, 50);

}

function drawResultText(subject, useBe, tense, positive, ask) {
   var canvas = document.getElementById('text-layer');
    if (!canvas.getContext){
        return;
    }

    var ctx = canvas.getContext('2d');
    ctx.font = '36px serif';
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.fillText(getResult(subject,useBe ,tense, positive, ask), 70, 250 , 340);
}


function pickSubject() {
    var index = getRandomInt(0, subjects.length);
    return subjects[index];
}

function pickUseBe() {
    if(cbTeacher.checked == cbMovie.checked) {
        return Math.floor(Math.random() * 2) == 0
    } else {
        return cbTeacher.checked;
    }    
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

function pickPositive() {
    var positive = true
    if(cbPositive.checked == cbNegative.checked) {
        positive = Math.floor(Math.random() * 2) == 0
    } else {
        positive = cbPositive.checked;
    }    
    return positive
}

function pickAsk() {
    if(cbAsk.checked == cbNoAsk.checked) {
        return Math.floor(Math.random() * 2) == 0
    } else {
        return cbAsk.checked;
    }    
}

function getResult(subject, useBe, tense, positive, ask) {
    if(ask) {
        var obj = "";
        if(useBe) {
            obj = getTeacher(subject.plural);
            return capitialize(getBeAsk(subject,tense, positive) + " " + obj + "?");
        } else {
            obj = movie;
            return capitialize(getAsk(subject,tense, see, positive) + " " + obj+ "?");
        }

    } else{
        var name = subject.name;
        var displayTense = "";
        var displayVerb = "";
        var obj = "";
        if(useBe) {
            displayTense = tense.getDisplayBeTense(subject, positive);
            displayVerb = getDisplayBeVerb(subject, tense, positive);
            obj = getTeacher(subject.plural);
        }else {
            displayTense = tense.getDisplayTense(subject, positive);
            displayVerb = see.getDisplayVerb(subject, tense, positive);
            obj = movie;
        }

        return capitialize(name + displayTense + displayVerb + " " + obj);
    }
}

function onLoadBody() {
    drawBackground();
    loadCheckboxStatus();
    setAudioPlayButtonVisible(false);
}

window.onload = function() {
    cbTeacher = document.getElementById("cbTeacher");
    cbMovie = document.getElementById("cbMovie");

    cbPast = document.getElementById("cbPast");
    cbPresent = document.getElementById("cbPresent");
    cbFuture = document.getElementById("cbFuture");

    cbProgressive = document.getElementById("cbProgressive");
    cbNotProgressive = document.getElementById("cbNotProgressive");
    cbPerfect = document.getElementById("cbPerfect");
    cbNotPerfect = document.getElementById("cbNotPerfect");

    cbPositive = document.getElementById("cbPositive");
    cbNegative = document.getElementById("cbNegative");

    cbAsk = document.getElementById("cbAsk");
    cbNoAsk = document.getElementById("cbNoAsk");
}

function onclickCheckbox(event) {
    saveCheckboxStatus();
}

function loadCheckboxStatus() {
    if( null == window.localStorage.getItem("cbTeacher") ) {
        cbTeacher.checked = true;
    } else {
        cbTeacher.checked = window.localStorage.getItem("cbTeacher") == "true";
    }

    if( null == window.localStorage.getItem("cbMovie") ) {
        cbMovie.checked = true;
    } else {
        cbMovie.checked = window.localStorage.getItem("cbMovie") == "true";
    }

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

    if( null == window.localStorage.getItem("cbAsk") ) {
        cbAsk.checked = true;
    } else {
        cbAsk.checked = window.localStorage.getItem("cbAsk") == "true";
    }

    if( null == window.localStorage.getItem("cbNoAsk") ) {
        cbNoAsk.checked = true;
    } else {
        cbNoAsk.checked = window.localStorage.getItem("cbNoAsk") == "true";
    }
}

function saveCheckboxStatus() {
    window.localStorage.setItem("cbTeacher", cbTeacher.checked);
    window.localStorage.setItem("cbMovie", cbMovie.checked);
    window.localStorage.setItem("cbPast", cbPast.checked);
    window.localStorage.setItem("cbPresent", cbPresent.checked);
    window.localStorage.setItem("cbFuture", cbFuture.checked);
    window.localStorage.setItem("cbProgressive", cbProgressive.checked);
    window.localStorage.setItem("cbNotProgressive", cbNotProgressive.checked);
    window.localStorage.setItem("cbPerfect", cbPerfect.checked);
    window.localStorage.setItem("cbNotPerfect", cbNotPerfect.checked);
    window.localStorage.setItem("cbPositive", cbPositive.checked);
    window.localStorage.setItem("cbNegative", cbNegative.checked);
    window.localStorage.setItem("cbAsk", cbAsk.checked);
    window.localStorage.setItem("cbNoAsk", cbNoAsk.checked);
}
