// Includes
var mutils = require('spooky/utils/utils');
var mstep = require('spooky/sync/step');
var maccount = require('joker/yahoo/account');
var mfetcher = require('joker/utils/proxied_fetcher');
var msolver = require('joker/dbc/solver');

// Consts
var URL_HOMEPAGE = 'http://www.yahoo.com';
var URL_SIGNUP = 'https://edit.yahoo.com/registration?.src=fpctx&.intl=us&.done=http://www.yahoo.com/';


// Constructor
function YahooAccountBuilder() {
    // Automagically proxied requests
    this.fetcher = new mfetcher.ProxiedFetcher();
    this.fetcher.buildPage();
    this.page = this.fetcher.page;
    this.page.viewportSize = { width: 1080, height: 1000 };
    this.user_account = maccount.buildRandomAccount();

    // Keep track of progress
    this.failed = false;
}



// Methods
YahooAccountBuilder.prototype.loadHomepage = function(callback) {
    this.page.open(URL_HOMEPAGE, callback);
}

YahooAccountBuilder.prototype.loadSignup = function(callback) {
    this.page.open(URL_SIGNUP, callback);
}

YahooAccountBuilder.prototype.injectJquery = function() {
    this.page.injectJs('web_js/jquery.js');
}


YahooAccountBuilder.prototype.captchaErrorMsg = function() {
    this.injectJquery();
    var errormsg = this.page.evaluate(function () {
        return $('#captchaFldMsg').text();
    });
    return errormsg;
}


YahooAccountBuilder.prototype.fillCaptcha = function(captcha) {
    this.injectJquery();
    this.page.evaluate(function(param) {
        $('#captchaV5Answer').val(param);
    }, '"' + captcha + '"');
}


YahooAccountBuilder.prototype.extractCaptchaURL = function() {
    this.injectJquery();
    // DEBUG
    var captchaSrc = this.page.evaluate(function() {
        return $('#captchaV5ClassicCaptchaImg').attr('src');
    });
    console.log("captchaSrc = "+captchaSrc)
    return captchaSrc;
}


YahooAccountBuilder.prototype.fillInPage = function(callback) {
    var _this = this;
    var json = JSON.stringify(this.user_account);
    var baseuriprof = null;
    var theUri = page.evaluate(function () { return document.baseURI;  });

    this.injectJquery();
    // Fomm in all the data
    var response = this.page.evaluate(function(user) {
        $('#firstname').val(user.firstname);
        $('#secondname').val(user.secondname);
        $('#gender option[value="m"]').attr("selected", "selected");
        $('#birthdategroup option[value="4"]').attr("selected", "selected");
        $('#dd').val(user.birthday);
        $('#yyyy').val(user.birthyear);
        $('#country option[value="us"]').attr("selected", "selected");
        $('#language option[value="en-US"]').attr("selected", "selected");
        $('#postalcode').val(user.postalcode);
        $('#yahooid').val(user.yahooid);
        $('#password').val(user.password);
        $('#passwordconfirm').val(user.password);
        $('#secquestion option[value="Where did you meet your spouse?"]').attr("selected", "selected");
        $('#secquestionanswer').val(user.secret1);
        $('#secquestion2 option[value="Where did you spend your childhood summers?"]').attr("selected", "selected");
        $('#secquestionanswer2').val(user.secret2);
        $('#language option[value="en-US"]').attr("selected", "selected");

        // Submit form
        $('#IAgreeBtn').click();
    },
        json
    );
  
    this.page.onLoadFinished = null;
    mutils.waitFor( function() {
        baseuriprof = _this.page.evaluate(function () {
            // Monitoring
           //console.log(document.baseURI);
           return [document.baseURI,document.querySelector('#regConfirmBody') ? 1 : 0]; 
           });
        return (baseuriprof[0] != theUri) || baseuriprof[1];},
    callback, 10000);
}


YahooAccountBuilder.prototype.run = function(account, callback) {
    // Pass useraccount
    this.user_account = account ? account : this.user_account;
    var _this = this;
    var captcha_url = this;
    var captcha_result = null;

    mstep.Step(
        // Go to homepage
        function loadHomepage() {
            var that = this;
            var f = function(value) { that(value); }
            console.log("Loading homepage")
            _this.loadHomepage(f);
        },
        // Now load signup page
        function loadSignup() {
            var that = this;
            console.log("Loading signup")
            _this.loadSignup(that);
        },
        // We need to wait for captcha to load, this isn't perfect, but does the job
        function waitForCaptcha() {
            // Wait 3 seconds
            mutils.spinFor(this, 3000);
        },
        // Get captcha
        function getCaptcha() {
            captcha_url = _this.extractCaptchaURL();
            return null;
        },
        function solveCaptcha() {
            var that = this;
            console.log("Solving captcha =  "+captcha_url);
            var solver = new msolver.DBCSolver();
            solver.solveURL(captcha_url, function(answer){
                console.log("ANSWER = "+answer);
                captcha_result = answer;
                that();
            });
        },
        function enterCaptcha() {
            console.log("CAPTCHA = "+captcha_result);
            _this.fillCaptcha(captcha_result);
            return null;
        },
        // Fills in form and submits it
        function fillFormSubit() {
            _this.fillInPage(this);
        },
        function finalize() {
            var errmsg = _this.captchaErrorMsg();

            // Sucess
            if(!errormsg) {
                return null;
            }
            // Failure -> loop
            //_this.run(callback);
            _this.failed = true;
            return null;
        },
        function doCallback() {
            var value = _this.failed ? null : _this.user_account;
            callback(value);
            return null;
        }
    );
}


// Exports
exports.YahooAccountBuilder = YahooAccountBuilder