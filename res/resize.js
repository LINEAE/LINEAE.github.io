var fs = require("fs")
var cp = require('child_process');

function d(arg) {
	console.log(arg);
}

function convert(filename) {
	var command = "convert imageArticle/" + filename + ".jpg -resize 320x320 imageArticleResized/" + filename + ".jpg";
	d(command);
	cp.exec(command);
}

var files = fs.readdirSync("imageArticle");
for( var i = 0; i < files.length; i++ ) {
	var filename = files[i];
	if( filename.indexOf(".jpg") > 0 ) {
		convert(filename.substr(0, filename.length - 4));
	}
}
