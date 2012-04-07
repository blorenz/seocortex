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

    this.pageBefore = function() { this.page.onLoadFinished = null };
    // Keep track of progress
    this.failed = false;
    _this = this;
}



// Methods
YahooAccountBuilder.prototype.loadHomepage = function(callback) {
    this.pageBefore();
    this.page.open(URL_HOMEPAGE, callback);
}

YahooAccountBuilder.prototype.loadSignup = function(callback) {
    this.pageBefore();
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
    console.log(_this);
    //_this.page.render('/var/www/html/stickybur.com/phantomjs/eeestit.png');
    var json = JSON.stringify(_this.user_account);
    console.log(json);
    var baseuriprof = null;
    theUri = _this.page.evaluate(function () { return document.baseURI;  });

    _this.formCallback = callback;
    this.injectJquery();
    // Fomm in all the data
    var response = _this.page.evaluate(function(user) {
        $('#firstname').val(user.firstname);
        $('#secondname').val(user.lastname);
        $('#gender option[value="m"]').attr("selected", "selected");
        $('#birthdategroup option[value="'+user.birthmonth+'"]').attr("selected", "selected");
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
  
    _this.page.onLoadFinished = null;
    mutils.spinFor(_this.formWait,3000);
}

YahooAccountBuilder.prototype.formWait = function() {
    mutils.waitFor( function() {
        baseuriprof = _this.page.evaluate(function () {
            // Monitoring
           //console.log(document.baseURI);
           return [document.baseURI,document.querySelector('#regConfirmBody') ? 1 : 0]; 
           });
        // Checks to see if the baseURI changes or finds the account successful
    /*    console.log('* START @*@#**')
        console.log(theUri);
        console.log(baseuriprof[0]);
        console.log(baseuriprof[1]);
        console.log(_this.captchaErrorMsg());
        console.log('* END @*@#**') */
        return (baseuriprof[0] != _this.theUri) || baseuriprof[1] || _this.captchaErrorMsg();},
    _this.formCallback, 10000);
}


YahooAccountBuilder.prototype.run = function(callback) {
    // Pass useraccount
    //this.user_account = account ? account : this.user_account;
    var captcha_url = this;
    var captcha_result = null;

    // Go to homepage
    var loadHomepage = function() {
        var that = this;
        console.log("Loading homepage")
        console.log(JSON.stringify(_this.user_account));
        _this.loadHomepage(loadSignup);
    }
    // Now load signup page
    var loadSignup = function() {
        console.log("Loading signup")
        _this.loadSignup(waitForCaptcha);
    }
    // We need to wait for captcha to load, this isn't perfect, but does the job
    var waitForCaptcha = function() {
        // Wait 3 seconds
        mutils.spinFor(getCaptcha, 3000);
    }
    // Get captcha
    var getCaptcha = function() {
        captcha_url = _this.extractCaptchaURL();
        solveCaptcha(captcha_url);
    }

    var solveCaptcha = function(captcha_url) {
        console.log("Solving captcha =  "+captcha_url);
        var solver = new msolver.DBCSolver();
        solver.solveURL(captcha_url, function(answer){
            console.log("ANSWER = "+answer);
            captcha_result = answer;
            enterCaptcha(captcha_result);
        });
    }
    
    var enterCaptcha = function(captcha_result) {
        console.log("CAPTCHA = "+captcha_result);
        _this.fillCaptcha(captcha_result);
        fillFormSubmit();
    }
    
    // Fills in form and submits it
    var fillFormSubmit = function() {
        console.log('Fill it out');
        _this.fillInPage(isCaptchaSuccessful);
    }

    var isCaptchaSuccessful = function() {
        var msg = _this.captchaErrorMsg();

        if (msg && msg.length > 0) {
            console.log('Wait for captcha');
            console.log(msg);

            waitForCaptcha();
        }
        else {
            console.log('going to the end!!');
            finalize();
        }

    }

    var finalize = function() {
        // Sucess
       var url = 'http://ifnseo.com:8088/yahoo/add?jsondata=' + encodeURIComponent(JSON.stringify(_this.user_account)); 
           console.log(url);
        require('webpage').create().open(url, theEnd);
    }

    var theEnd = function(success) {
        if (success)
            console.log('Success');
        else
            console.log('Failure');

    }
    
    var doCallback = function() {
        var value = _this.failed ? null : _this.user_account;
        callback(value);
        return null;
    }


    loadHomepage();
}

var exports = exports || {};
// Exports
exports.YahooAccountBuilder = YahooAccountBuilder


//var testyab = new YahooAccountBuilder();
//testyab.run();
