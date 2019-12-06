
var subject = null
var verb = null
var tense = null

function quiz() {
    subject = pickSubject();
    verb = pickVerb()
    tense = pickTense();

    console.log(subject+
        "\n" + verb +
        "\n" + tense +
        "\n" + getResult(subject,verb,tense))
    drawTense(tense.tense,tense.progressive, tense.perfect);
    drawQuizText(subject, verb);
}

function answer() {
   drawResultText(subject,verb,tense);
}

var nextCount = 0
function next() {
    if( nextCount++ %2 == 0 ) {
        quiz()
    } else {
        answer()
    }
}

function drawQuizText(subject, verb) {
   var canvas = document.getElementById('text-layer');
    if (!canvas.getContext){
        return;
    }

    var ctx = canvas.getContext('2d');
    ctx.font = '36px serif';
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillText(subject.name, 70, 50);

    ctx.fillText(verb.base, 270, 50);
    ctx.font = '20px serif';
    ctx.fillText(verb.kor, 270, 80 , 200);

}

function drawResultText(subject, verb, tense) {
   var canvas = document.getElementById('text-layer');
    if (!canvas.getContext){
        return;
    }

    var ctx = canvas.getContext('2d');
    ctx.font = '36px serif';
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';
    ctx.fillText(getResult(subject,verb,tense), 70, 250 , 340);

    ctx.fillStyle = 'red';
    ctx.fillText(verb.base + " - " + verb.past + " - " + verb.perfect, 70, 290 , 340);
}


function pickSubject() {
    var index = getRandomInt(0, subjects.length);
    return subjects[index];
}

function pickTense() {
    var arTense = []
    if(cbPresent.checked) { arTense.push(TenseEnum.present) }
    if(cbPast.checked) { arTense.push(TenseEnum.past) }
    if(cbFuture.checked) { arTense.push(TenseEnum.future) }
    if( arTense.length == 0 ) { arTense.push(TenseEnum.present)}
    shuffle(arTense)

    var progressive = false
    if( cbProgressive.checked ) { progressive = Math.floor(Math.random() * 2) == 0 }

    var perfect = false
    if( cbPerfect.checked ) { perfect = Math.floor(Math.random() * 2) == 0 }

    return new Tense(arTense[0], progressive, perfect)
}

function pickVerb() {
    var index = getRandomInt(0, verbs.length);
    return verbs[index];
}

function convertToThird(verb) {
    //불규칙이 있을 경우 처리
    if(verb.third && verb.third != "") {
        return verb.third;
    }

    var base = verb.base
    var lastIndex = base.length - 1;
    var lastCh = base[lastIndex];
    var newVerb = base.slice(0, lastIndex);
    switch(lastCh) {
        case 'a':
        case 'i':
        case 'o':
        case 'u':
            newVerb = newVerb + lastCh + "es";  //동사 뒤에는 es
            break;
        case 'y':
            newVerb += "ies";   //y는 i로 고치고 ex
            break;
        default:
            newVerb = newVerb + lastCh + "s";   //나머지는 s
            break;       
    }
    return newVerb;

}

function getResult(subject, verb, tense) {
    var name = subject.name;

    var verbPrefix = "";
    var displayVerb = "";
    switch (tense.tense) {
        case TenseEnum.present: {
            if (tense.perfect == true) {
                if (subject.person == PersonEnum.third && subject.plural == PluralEnum.singular) {
                    verbPrefix += "has ";
                } else {
                    verbPrefix += "have ";
                }

                if (tense.progressive == true) {
                    verbPrefix += "been ";
                    displayVerb = verb.progressive;
                } else {
                    displayVerb = verb.perfect;
                }

            } else {
                if (tense.progressive == true) {
                    if (subject.person == PersonEnum.first && subject.plural == PluralEnum.singular) {
                        verbPrefix += "am ";
                    } else if (subject.person == PersonEnum.third && subject.plural == PluralEnum.singular) {
                        verbPrefix += "is ";
                    } else {
                        verbPrefix += "are ";
                    }
                    displayVerb = verb.progressive;
                } else {
                    if (subject.person == PersonEnum.third && subject.plural == PluralEnum.singular) {
                        displayVerb = convertToThird(verb);
                    } else {
                        displayVerb = verb.base;
                    }
                }
            }
            break;
        }
        case TenseEnum.past: {
            if (tense.perfect == true) {
                verbPrefix += "had ";
                if (tense.progressive == true) {
                    verbPrefix += "been ";
                    displayVerb = verb.progressive;
                } else {
                    displayVerb = verb.perfect;
                }

            } else {
                if (tense.progressive == true) {
                    if (subject.person == PersonEnum.first && subject.plural == PluralEnum.singular) {
                        verbPrefix += "was ";
                    } else if (subject.person == PersonEnum.third && subject.plural == PluralEnum.singular) {
                        verbPrefix += "was ";
                    } else {
                        verbPrefix += "were ";
                    }
                    displayVerb = verb.progressive;
                } else {
                    displayVerb = verb.past;
                }
            }
            break;
        }

        case TenseEnum.future: {
            verbPrefix += "will ";
            if (tense.perfect == true) {
                verbPrefix += "have ";
                if (tense.progressive == true) {
                    verbPrefix += "been ";
                    displayVerb = verb.progressive;
                } else {
                    displayVerb = verb.perfect;
                }

            } else {
                if (tense.progressive == true) {
                    verbPrefix += "be ";
                    displayVerb = verb.progressive;
                } else {
                    displayVerb = verb.base;
                }
            }
            break;
        }
    }

    return name + " " + verbPrefix + displayVerb
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
    cbPerfect = document.getElementById("cbPerfect");
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

    if( null == window.localStorage.getItem("cbPerfect") ) {
        cbPerfect.checked = true;
    } else {
        cbPerfect.checked = window.localStorage.getItem("cbPerfect") == "true";
    }
}

function saveCheckboxStatus() {
    window.localStorage.setItem("cbPast", cbPast.checked);
    window.localStorage.setItem("cbPresent", cbPresent.checked);
    window.localStorage.setItem("cbFuture", cbFuture.checked);
    window.localStorage.setItem("cbProgressive", cbProgressive.checked);
    window.localStorage.setItem("cbPerfect", cbPerfect.checked);
}