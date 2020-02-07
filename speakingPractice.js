
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

class Sentence{
    constructor(subject,useBe,tense,positive,ask) {
        this.subject = subject;
        this.useBe = useBe;
        this.tense = tense;
        this.positive = positive;
        this.ask = ask;
    }
}
var items = [];
(function () {
    var index = 0;
    for (var i = 0; i < subjects.length; i++) {
        var s = subjects[i];    //subject
        for(var j = 0; j < 2; j++) {
            var u = j == 0;     //act or exist
            for(var l = 0; l < 2; l++) {
                    var a = l == 1; // ask
                    for(var m = 0; m < 2; m++) {
                        var p = m == 0; //positive
                        for(var k = 0; k < tenses.length;k++) {
                            var t = tenses[k];  //tense
                            if(u && t.progressive) {
                                continue;
                            }
                            items[index] = new Sentence(s,u,t,p,a);
                            index++;
                        }
                        
                    }
                }

            

        }
       
    }
})()

var item = null

var groupSize = 50


function onLoadBody() {
    drawBackground();
    lsCheckVocaKrToEn = new LSCheckbox(checkbox_kr_to_en, "voca_kr_to_en", true)
    lsCheckVocaRandom = new LSCheckbox(checkbox_random, "voca_random", false)
    lsCheckVocaPlaySound = new LSCheckbox(checkbox_play_sound, "voca_play_sound", true)
    lsFromIndex = new LSValue("voca_group_from_index", 1)
    lsToIndex = new LSValue("voca_group_to_index", 1)
    loadStatus();

    span_from.innerText = slider_from.value
    span_to.innerText = slider_to.value * groupSize
    span_current.innerText = slider_current.value

    slider_from.oninput = function () {
        span_from.innerText = (this.value * groupSize - groupSize + 1)
        if (new Number(slider_from.value) > new Number(slider_to.value)) {
            slider_to.value = this.value
            span_to.innerText = this.value * groupSize
            lsToIndex.setValue(this.value)
        }
        lsFromIndex.setValue(this.value)
    }
    slider_to.oninput = function () {
        span_to.innerText = this.value * groupSize
        if (new Number(slider_to.value) < new Number(slider_from.value)) {
            slider_from.value = this.value
            span_from.innerText = (this.value * groupSize - groupSize + 1)
            lsFromIndex.setValue(this.value)
        }
        lsToIndex.setValue(this.value)
    }
    slider_current.oninput = function () {
        span_current.innerText = this.value
        currentIndex = new Number(this.value)
    }

    slider_from.max = items.length / groupSize
    slider_to.max = Math.floor(items.length / groupSize)
    slider_current.max = items.length

    slider_from.value = lsFromIndex.getEval()
    slider_from.oninput()
    slider_to.value = lsToIndex.getEval()
    slider_to.oninput()
}

var currentIndex = null
function getNext() {
    if (isNaN(currentIndex)) {
        currentIndex = -1;
    }

    if (currentIndex < new Number(span_from.innerText) - 1 || currentIndex >= new Number(span_to.innerText) - 1) {
        currentIndex = new Number(span_from.innerText) - 1
    } else {
        currentIndex++
    }

    slider_current.value = (new Number(currentIndex) + 1)
    span_current.innerText = (new Number(currentIndex) + 1)

    saveStatus()
    return items[currentIndex];
}

var randomStartIndex = 0
var randomEndIndex = 0
var randomQuizSlot = []
function getRandom() {
    var currentRandomStartIndex = eval(span_from.innerText)
    var currentRandomEndIndex = eval(span_to.innerText)
    if (randomStartIndex == currentRandomStartIndex && randomEndIndex == currentRandomEndIndex) {
        if (randomQuizSlot.length == 0) {
            refill()
        }
    } else {
        randomStartIndex = currentRandomStartIndex
        randomEndIndex = currentRandomEndIndex

        refill()
    }

    var randomIndex = randomQuizSlot.pop()
    slider_current.value = (new Number(randomIndex) + 1)
    span_current.innerText = (new Number(randomIndex) + 1)

    return items[randomIndex]
}

function refill() {
    randomQuizSlot = []
    for (var i = randomStartIndex; i <= randomEndIndex; i++) {
        randomQuizSlot.push(eval(i))
    }
    shuffle(randomQuizSlot)
    log("Random slot refilled " + randomQuizSlot)
}

function loadStatus() {
    currentIndex = eval(window.localStorage.getItem("currentIndex_speaking"))
    if (null == currentIndex) { currentIndex = 0; }
}

function saveStatus() {
    window.localStorage.setItem("currentIndex_speaking", currentIndex);
}

function audioPlay() {
    currentIndex = -1
}

function onclickCheckbox() {
    lsCheckVocaKrToEn.save();
    lsCheckVocaRandom.save();
    lsCheckVocaPlaySound.save();
    nextCount = 0
}

function quiz() {

    if (lsCheckVocaRandom.checked()) {
        item = getRandom()
        div_status.innerText = "Random: " + randomStartIndex + "~" + randomEndIndex + ", remains:" + (randomQuizSlot.length)
    } else {
        item = getNext()
        div_status.innerText = "Sequential: " + (new Number(currentIndex) + 1) + "/" + (items.length)
    }

    subject = item.subject
    useBe = item.useBe
    tense = item.tense
    positive = item.positive
    ask = item.ask

    console.log(subject+
        "\n" + useBe +
        "\n" + tense +
        "\n" + positive +
        "\n" + ask +
        "\n" + getResult(subject,useBe,tense,positive, ask))
    drawTense(tense.tense,tense.progressive, tense.perfect);
    drawQuiz(subject, useBe, positive, ask);
}

function answer() {
   drawResultText(item.subject,item.useBe,item.tense, item.positive, item.ask);
}

var nextCount = 0
function next() {
    if( nextCount++ %2 == 0 ) {
        quiz()
    } else {
        answer()
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

        return capitialize(name + displayTense + displayVerb + " " + obj + ".");
    }
}


