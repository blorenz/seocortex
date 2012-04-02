// Includes


// Constructor
function DCBResponse(page) {
    this.page = page;
}


DCBResponse.prototype.getResult = function(callback) {

    this.page.injectJs('jquery.js');
    var poll = this.page.evaluate(function() { return document.baseURI; });
    var query = this.page.evaluate(function() { return $('pre').text(); });

    var tester = new WebPage();
    var captcha = null;

    // Now poll Death By Captcha for the result
    waitFor(function() {
        captchaTest.onLoadFinished = function() {
            tester.injectJs('jquery.js');
            query = captchaTest.evaluate(function() { return $('pre').text(); });
            var re = /text=(.*)\&/;
            captcha = re.exec(query)[1];
        };

        tester.open(poll);
            return (captcha ? captcha.length > 0 : false); 

        },
        function() {
            callback(captcha);
        },
        60000,
        3000);
}


// Exports
exports.DCBResponse = DCBResponse