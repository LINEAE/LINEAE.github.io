
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

    var player = document.getElementById("audio-player")
    player.removeAttribute("src")
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

function playAudio() {
    var text = verb.base + " " + verb.past + " " + verb.perfect
    var player = document.getElementById("audio-player")
    
    if(player.src) {
        player.play()
    }else {
        playSpeechFromText(player, text)
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
    if(cbPresent.checked() == false && cbPast.checked() == false && cbFuture.checked() == false) {
        arTense.push(TenseEnum.present)
        arTense.push(TenseEnum.past)
        arTense.push(TenseEnum.future)
    }
    else {
        if(cbPresent.checked()) { arTense.push(TenseEnum.present) }
        if(cbPast.checked()) { arTense.push(TenseEnum.past) }
        if(cbFuture.checked()) { arTense.push(TenseEnum.future) }
    }
    shuffle(arTense)

    var progressive = false
    if(cbProgressive.checked() == cbNotProgressive.checked()) {
        progressive = Math.floor(Math.random() * 2) == 0
    } else {
        progressive = cbProgressive.checked();
    }

    var perfect = false
    if(cbPerfect.checked() == cbNotPerfect.checked()) {
        perfect = Math.floor(Math.random() * 2) == 0
    } else {
        perfect = cbPerfect.checked();
    }

    return new Tense(arTense[0], progressive, perfect)
}

function pickVerb() {
    var index = getRandomInt(0, verbs.length);
    return verbs[index];
}

function pickPositive() {
    var positive = true
    if(cbPositive.checked() == cbNegative.checked()) {
        positive = Math.floor(Math.random() * 2) == 0
    } else {
        positive = cbPositive.checked();
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

    cbPast = new LSCheckbox(document.getElementById("cbPast"), "cbTensePast", true);
    cbPresent = new LSCheckbox(document.getElementById("cbPresent"), "cbTensePresent", true);
    cbFuture = new LSCheckbox(document.getElementById("cbFuture"), "cbTenseFuture", true);

    cbProgressive = new LSCheckbox(document.getElementById("cbProgressive"), "cbTenseProgressive", true);
    cbNotProgressive = new LSCheckbox(document.getElementById("cbNotProgressive"), "cbTenseNotProgressive", true);
    cbPerfect = new LSCheckbox(document.getElementById("cbPerfect"), "cbTensePerfect", true);
    cbNotPerfect = new LSCheckbox(document.getElementById("cbNotPerfect"), "cbTenseNotPerfect", true);

    cbPositive = new LSCheckbox(document.getElementById("cbPositive"), "cbTensePositive", true);
    cbNegative = new LSCheckbox(document.getElementById("cbNegative"), "cbTenseNegative", true);
}

function onclickCheckbox(event) {
    cbPast.save();
    cbPresent.save();
    cbFuture.save();

    cbProgressive.save();
    cbNotProgressive.save();
    cbPerfect.save();
    cbNotPerfect.save();

    cbPositive.save();
    cbNegative.save();
}