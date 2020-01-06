class Voca {
    constructor(eng, kor, pronounce, audioKey) {
        this.eng = eng;
        this.kor = kor;
        this.pronounce = pronounce;
        this.audioKey = audioKey
    }

    engHtml(withAudio) {
        var result = this.eng

        if( this.pronounce ) {
            result += "<br>" + this.pronounce
        }

        if( withAudio && this.audioKey ) {
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

class VocaTrainer {
    constructor(srcData, firstSlotSize) {
        this.srcData = srcData;
        this.srcIndex = lsVarSrcIndex.getEval();
        this.slotData = lsVarSlotData.getEval();
        this.slotIndex = lsVarSlotIndex.getEval();

        this.slotSetting = [firstSlotSize]
        for( var i = 0; i < 4; i++ ) {
            this.slotSetting.push(Math.ceil(this.slotSetting[this.slotSetting.length-1] * 2.1))
        }
    
        if( this.slotData.length != this.slotSetting.length ) {
            this.slotData = [];
            for(var i = 0; i < this.slotSetting.length; i++ ) {
                this.slotData.push( [] )
            }
        }
    }

    init(slotContainer) {
        slotContainer.innerHTML = ""

        this.elProgressSrc = document.createElement("progress")
        this.elProgressSrc.classList.add("progress_src")
        this.elProgressSrc.max = this.srcData.length
        this.elProgressSrc.value = this.srcIndex
        this.elProgressSrc.style.width = "480px"
        slotContainer.appendChild(this.elProgressSrc)

        this.elProgressSlots = [];
        for(var i = 0; i < this.slotSetting.length; i++ ) {
            var progress = document.createElement("progress")
            progress.classList.add("progress_slot")
            progress.max = this.slotSetting[i]
            progress.value = this.slotData[i].length
            slotContainer.appendChild(progress)
            this.elProgressSlots.push(progress)
        }
    }

    getNext() {
        for(var i = 0; i < this.slotData.length; i++ ) {
            if( this.slotData[i].length >= this.slotSetting[i] ) {
                log("change slot : " + this.slotIndex + " -> " + i)
                this.slotIndex = i;
                break;
            }
        }

        if( this.slotData[this.slotIndex].length == 0 ) {
            if( this.srcIndex >= this.srcData.length ) {
                this.slotIndex = 0
                while(this.slotData[this.slotIndex].length == 0) {
                    log("change slot : " + this.slotIndex + " -> " + (this.slotIndex + 1))
                    this.slotIndex++

                    if( this.slotIndex >= this.slotData.length ) {
                        alert("Complete!")
                        return
                    }
                }
            } else {
                log("change slot : " + this.slotIndex + " -> 0")
                this.slotIndex = 0
            }
        }

        this.refill();

        var itemIndex = this.slotData[this.slotIndex][0]

        this.updateUI()

        return vocas[itemIndex];
    }

    remembered() {
        var currentIndex = this.slotData[this.slotIndex].shift()

        if( this.slotIndex < this.slotData.length - 1 ) {
            this.slotData[this.slotIndex + 1].push(currentIndex)
        } else {
            // Completely Remembered
        }

        this.updateUI()
    }

    forgot() {
        var currentIndex = this.slotData[this.slotIndex].shift()

        if( this.slotIndex > 0 ) {
            this.slotData[this.slotIndex - 1].push(currentIndex)
        } else {
            this.slotData[this.slotIndex].push(currentIndex)
        }


        this.updateUI()
    }

    refill() {
        if( this.slotIndex == 0 && this.slotData[0].length == 0 ) {
            for( var i = 0; i < this.slotSetting[0] && this.srcIndex < this.srcData.length; i++ ) {
                this.slotData[0].push( this.srcIndex++ )
            }
            if( this.slotData[0].length > 0 ) {
                log("refilled")
            }
        }
    }

    updateUI() {
        this.elProgressSrc.value = this.srcIndex
        for( var i = 0; i < this.elProgressSlots.length; i++ ) {
            var elProgress = this.elProgressSlots[i]
            elProgress.value = this.slotData[i].length
            elProgress.classList.remove("current_slot")
            if( this.slotIndex == i ) {
                elProgress.classList.add("current_slot")
            }
        }

        lsVarSrcIndex.setValue(this.srcIndex)
        lsVarSlotData.setValue(JSON.stringify(this.slotData))
        lsVarSlotIndex.setValue(this.slotIndex)
    }

    status() {
        var status = "[total: " + this.srcIndex + ":" + (this.srcData.length + 1) + "]"
        for( var i = 0; i < this.slotData.length; i++ ) {
            status += "[" + this.slotData[i].length + ":" + this.slotSetting[i] + "]"
        }
        return status
    }
}


var vocaTrainer = null
var voca = null
var currentIndex = null

var FIRST_SLOT_SIZE = 30

function onLoadBody() {
    lsCheckKrToEn = new LSCheckbox(checkbox_kr_to_en, "voca_training_kr_to_en", true)
    lsCheckPlaySound = new LSCheckbox(checkbox_play_sound, "voca_training_play_sound", false)

    lsVarSrcIndex = new LSValue("voca_training_src_index", "0")
    lsVarSlotData = new LSValue("voca_training_slot_data", "[]")
    lsVarSlotIndex = new LSValue("voca_training_slot_index", "0")

    vocaTrainer = new VocaTrainer(vocas, FIRST_SLOT_SIZE)
    vocaTrainer.init(div_slot_container)

    btn_answer.style.display = "none"
    div_confirm.style.display = "none"
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
    div_status.innerText=""
}

function initialize() {
    if( confirm("Remove all local storage data?") ) {
        lsVarSlotData.remove()
        lsVarSlotIndex.remove()
        lsVarSrcIndex.remove()
        vocaTrainer = new VocaTrainer(vocas, FIRST_SLOT_SIZE)
        vocaTrainer.init(div_slot_container)
        alert("Cleared")
    }
}

function quiz() {
    clear()

    voca = vocaTrainer.getNext()
    if( null == voca ) {
        log("Complete")
        return
    }

    div_status.innerText = vocaTrainer.status()

    if( lsCheckKrToEn.checked() ) {
        div_question.innerText = voca.kor
    } else {
        div_question.innerHTML = voca.engHtml(lsCheckPlaySound.checked())
    }

    div_start.style.display = "none"
    btn_answer.style.display = "block"
}

function answer() {
    if( checkbox_kr_to_en.checked ) {
        div_answer.innerHTML = voca.engHtml(lsCheckPlaySound.checked())
    } else {
        div_answer.innerText = voca.kor
    }
    btn_answer.style.display = "none"
    div_confirm.style.display = "block"
}

function remembered() {
    div_confirm.style.display = "none"
    btn_answer.style.display = "block"
    vocaTrainer.remembered()
    quiz()
}

function forgot() {
    div_confirm.style.display = "none"
    btn_answer.style.display = "block"
    vocaTrainer.forgot()
    quiz()
}

function onclickCheckbox() {
    lsCheckKrToEn.save();
    lsCheckPlaySound.save();
    nextCount = 0
}


var intervalId = null
function test() {
    stop()
    intervalId = setInterval(autoQuiz, 1)
}

var answerRate = 0.9;
function autoQuiz() {
    quiz()
    if( Math.random() <= answerRate ) {
        vocaTrainer.remembered()
    } else {
        vocaTrainer.forgot()
    }
}

function stop() {
    if( null != intervalId ) {
        clearInterval(intervalId)
        intervalId = null
    }
}