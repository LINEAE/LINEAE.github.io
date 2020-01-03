var req = require("sync-request");
const cheerio = require("cheerio");
const fs = require("fs");
const log = console.log;

// config
var src_file_name = "preposition_data"
var from = 0
var until = from + 55

var src_data = fs.readFileSync(src_file_name + ".js", "utf8")
var splits = src_data.split("\n")
var sliced = splits.slice(2, splits.length)
var joined = sliced.join("\n")
var datas = JSON.parse(joined)

datas = datas.slice(from, until)

function appendPronounce(data) {
    try {
        if( null != data[3] ) {
            log("SKIP : " + data[0])
            return
        }

        var url = "https://dic.daum.net/search.do?q=" + data[0].replace(" ", "+")
        log("==> " + data[0] + " : " + url)

        const $ = cheerio.load(req("GET", url).getBody("utf8"));
        const voice = $("a.btn_voice.btn_listen")[0].attribs.href
        data[3] = voice.replace("http://t1.daumcdn.net/language/", "")

        log(data)
    } catch (e) {
        log(e)
    }
}

for(var i = 0; i < datas.length; i++) {
    var data = datas[i]
    appendPronounce(data)
}

fs.writeFileSync(src_file_name + "+" + from + "_" + until + ".js", JSON.stringify(datas).replace(/\],\[/g, "],\n[").replace("[[", "[").replace("]]", "],"))

