// Includes
var mstep = require('spooky/sync/step');

// Constructor
function DCBResponse(page) {
    this.page = page;
}


DCBResponse.prototype.getResult = function(callback) {

    this.page.injectJs('../common/jquery.js');
    var poll = this.page.evaluate(function() { return document.baseURI; });
    var query = this.page.evaluate(function() { return $('pre').text(); });

    var tester = new WebPage();
    var captcha = null;

    mstep.Step(
        // Now poll Death By Captcha for the result
        function() {
            waitFor(function() {
                tester.onLoadFinished = function() {
                    tester.injectJs('../common/jquery.js');
                    query = tester.evaluate(function() { return $('pre').text(); });
                    var re = /text=(.*)\&/;
                    captcha = re.exec(query)[1];
                };

                tester.open(poll);
                    return (captcha ? captcha.length > 0 : false); 

                },
                function() {
                    console.log("Finished parsing response");
                },
                60000,
                3000);
            return captcha;
        },
        // Run callback
        function(result) {
            callback(result);
        }
    );
}


// Exports
exports.DCBResponse = DCBResponse