var page = new WebPage();

var url = "https://accounts.google.com/Login";

page.onLoadStarted = function () {
    console.log('Start loading...');
};

page.onLoadFinished = function (status) {
    console.log('Loading finished.');
    console.log(page.content.length);
    phantom.exit();
};

page.open(url);
