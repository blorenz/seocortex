// Includes
var mutils = require('spooky/utils/utils');
var mstep = require('spooky/sync/step');


// Utility function
function isCaptchaValid(captcha) {
    return (captcha ? captcha.length > 0 : false);
}


// Loop body of captcha extractor
function extractCaptcha(page) {
    page.injectJs('web_js/jquery.js');
    var query = page.evaluate(function() { return $('pre').text(); });
    var re = /text=(.*)\&/;
    var captcha = re.exec(query)[1];
    var is_valid = isCaptchaValid(captcha);

    if(is_valid) {
        return captcha;
    }
    // Else
    return null;
}


// Constructor
function DCBResponse(page) {
    this.page = page;
}


DCBResponse.prototype.getResult = function(callback) {

    this.page.injectJs('web_js/jquery.js');
    var poll = this.page.evaluate(function() { return document.baseURI; });
    var query = this.page.evaluate(function() { return $('pre').text(); });

    var tester = new WebPage();
    var captcha = null;

    mstep.Step(
        // Now poll Death By Captcha for the result
        function openTester() {
            var that = this;
            var lock = true;
            var f = function(arg) { that(arg); }
            tester.onLoadFinished = function() { lock = false; };
            tester.onLoadStarted = function() { lock = true; };
            tester.open(poll);
            mutils.waitFor(
                // Test if ready
                function() {
                    if(lock) {
                        return false;
                    }
                    captcha = extractCaptcha(tester);
                    if(captcha) {
                        return true;
                    }
                    // else
                    tester.open(poll);
                    return false;

                },
                // On ready
                that,
                // Timeout, tick
                60000, 3000
            );
        },
        function doCallback() {
            callback(captcha);
            return null;
        }
    );
}


// Exports
exports.DCBResponse = DCBResponse