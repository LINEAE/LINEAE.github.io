const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const log = console.log;

var voca_data_0500 = fs.readFileSync("voca_data_0500.js", "utf8")
var splits = voca_data_0500.split("\n")
var sliced = splits.slice(2, splits.length)
var joined = sliced.join("\n")
var voca500 = JSON.parse(joined)

function sleep(t){
   return new Promise(resolve=>setTimeout(resolve,t));
}

// test
var from = 400
var until = from + 50
voca500 = voca500.slice(from, until)
pending = {}

for(var i = 0; i < voca500.length; i++) {
    var voca = voca500[i]
    appendPronounce(voca)
}

var watcherId = setInterval(waitWatcher, 1000);

function waitWatcher() {
    var keys = Object.keys(pending)
    if( keys.length <= 0 ) {
        clearInterval(watcherId)
        log(voca500)
        fs.writeFileSync("voca_data_0500+"+from+ "_"+ until +".js", JSON.stringify(voca500).replace(/\],\[/g, "],\n[").replace("[[", "[").replace("]]", "],"))
    }
}

function appendPronounce(voca) {
    pending[voca[0]] = ""

    // axios.get("https://dict.naver.com/search.nhn?dicQuery=" + voca[0])
    axios.get("https://dic.daum.net/search.do?q=" + voca[0])
    .then(html => {
        let ulList = [];
        const $ = cheerio.load(html.data);
        const pronounce = $("span.txt_pronounce").first().text()
        voca[2] = pronounce

        // log($("span.desc_listen").children())
        log($("span.txt_pronounce").first().text())

        const voice = $("a.btn_voice.btn_listen")[0].attribs.href
        voca[3] = voice

        log(voca)

        delete pending[voca[0]]
    })
}