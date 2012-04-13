phantom.injectJs('joker/yahoo/base.js');

var YahooAccountBuilder = function() {
    YahooBase.apply(this);

}

YahooAccountBuilder.prototype = new YahooBase();


// Methods

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
    console.log('Fill in page this: ' + this);
    //this.page.render('/var/www/html/stickybur.com/phantomjs/eeestit.png');
    var json = JSON.stringify(this.user_account);
    console.log(json);
    var baseuriprof = null;
    theUri = mutils.getURI(this.page);

    this.formCallback = callback;
    this.injectJquery();
    // Fomm in all the data

    var user = this.user_account;

    var userSelects = {
        gender:'#gender option[value="m"]',
        birthdaygroup:'#birthdategroup option[value="'+user.birthmonth+'"]',
        country:'#country option[value="us"]',
        language:'#language option[value="en-US"]',
        sec1:'#secquestion option[value="Where did you meet your spouse?"]',
        sec2:'#secquestion2 option[value="Where did you spend your childhood summers?"]',
        langA:'#language option[value="en-US"]',
    };

    var userObject = { '#firstname':user.firstname,
        '#secondname':user.lastname,
        '#dd':user.birthday,
        '#yyyy':user.birthyear,
        '#postalcode':user.postalcode,
        '#yahooid':user.yahooid,
        '#password':user.password,
        '#passwordconfirm':user.password,
        '#secquestionanswer':user.secret1,
        '#secquestionanswer2':user.secret2,
    } ;

    mutils.populateTextInputs(this.page,userObject);
    mutils.populateSelectInputs(this.page,userSelects);

/*    var response = this.page.evaluate(function(user) {
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
 */

    var response = this.page.evaluate( function() {
        $('#IAgreeBtn').click();
    });

    this.page.onLoadFinished = null;
    mutils.spinForWithParam(this.formWait,this,3000);
}


YahooAccountBuilder.prototype.regConfirm = function(par) {
    return par.page.evaluate(function () {
       return [document.baseURI,document.querySelector('#regConfirmBody') ? 1 : 0];
       });
}

YahooAccountBuilder.prototype.formWait = function(par) {

    console.log('this in formwait: ' + par);
    mutils.waitForWithParam(function(newpar) {
                console.log(newpar);
            baseuriprof = par.regConfirm(par);
        return (baseuriprof[0] != newpar.theUri) || baseuriprof[1] || newpar.captchaErrorMsg();},
        par,
    par.formCallback, 10000);
}


YahooAccountBuilder.prototype.run = function(callback) {
    // Pass useraccount
    //this.user_account = account ? account : this.user_account;

    var par = this;
    // Go to homepage
    var loadHomepage = function() {
        console.log("Loading homepage")
        console.log(JSON.stringify(par.user_account));
        console.log('before load');
        par.loadHomepage(loadSignup);
    }
    // Now load signup page
    var loadSignup = function() {
        console.log("Loading signup")
        par.loadSignup(waitForCaptcha);
    }
    // We need to wait for captcha to load, this isn't perfect, but does the job
    var waitForCaptcha = function() {
        // Wait 3 seconds
        mutils.spinFor(getCaptcha, 3000);
    }
    // Get captcha
    var getCaptcha = function() {
        captcha_url = par.extractCaptchaURL();
        if (captcha_url)
            solveCaptchaURL(captcha_url);
        else
            fillFormSubmit();

    }

    var solveCaptchaURL = function(captcha_url) {
      var url = "http://ifnseo.com:9999/dbc/solve_url?url=" + captcha_url;
      
        par.newFetcher = new mfetcherreg.Fetcher();
        par.newFetcher.buildPage();
        par.newpage = par.newFetcher.page;

        par.newpage.open(url, dbcResponse);
    }

    var dbcResponse = function() {
        par.newpage.injectJs('web_js/jquery.js');
        var jsonString = par.newpage.evaluate(function() {
            return $('pre').text();
        });
       
        console.log(par.newpage.content);
        console.log("This is JSON: " + jsonString);
        var captchaResponse = JSON.parse(jsonString);
       
        // MAY BE NULL! FIX THIS
        enterCaptcha(captchaResponse.data.text);
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
        par.fillCaptcha(captcha_result);
        fillFormSubmit();
    }
    
    // Fills in form and submits it
    var fillFormSubmit = function() {
        console.log('Filling out form');
        par.fillInPage(isCaptchaSuccessful);
    }

    var isCaptchaSuccessful = function() {
        var msg = par.captchaErrorMsg();

        if (msg && msg.length > 0) {
            console.log('Wait for captcha: ' + msg);

            waitForCaptcha();
        }
        else {
            console.log('going to the end!!');
            finalize();
        }

    }

    var finalize = function() {
        // Sucess
       var url = 'http://ifnseo.com:8088/yahoo/add?jsondata=' + encodeURIComponent(JSON.stringify(par.user_account)); 
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
        var value = par.failed ? null : par.user_account;
        callback(value);
        return null;
    }

    loadHomepage();
}

var exports = exports || {};
// Exports
exports.YahooAccountBuilder = YahooAccountBuilder

