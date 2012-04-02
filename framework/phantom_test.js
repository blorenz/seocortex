var page = new WebPage();

var url = "http://peoplze.com/login";


function parseContent(content) {
}


page.onLoadStarted = function () {
    console.log('Start loading...');
};


page.onLoadFinished = function (status) {
    console.log('Loading finished.');
    console.log(page.content.length);
    parseContent(page.content);
};

page.open(url);
