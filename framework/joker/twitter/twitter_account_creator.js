// Includes
var mutils = require('spooky/utils/utils');
var mfetcherreg = require('spooky/io/fetcher');
var mfetcher = require('joker/utils/proxied_fetcher');

var mdbc = require('joker/dbc/dbc');
var mnames = require('joker/names/names');

var system = require('system');


// Consts
var URL_SIGNUP = 'http://www.twitter.com/signup';
var DEBUG_MODE = true;

function TwitterAccountCreator(seo_id,user_account) {
    this.fetcher = new mfetcher.ProxiedFetcher();
    this.fetcher.buildPage();
    this.page = this.fetcher.page;
    this.page.viewportSize = { width: 1080, height: 1000 };
    this.pageBefore = function() { this.page.onLoadFinished = null };
   
    this.seocortex_profile_id = seo_id;
    this.userAccount = user_account ? user_account : new Object();
    
    this.captcha_url = this;
    this.captcha_result = null;
    this.newFetcher = null;
    this.newpage = null;
}




//var done = false;
// Fills out the signup page


TwitterAccountCreator.prototype.injectJquery = function() {
    this.page.injectJs('web_js/jquery.js');
}

TwitterAccountCreator.prototype.extractCaptchaURL = function() {
    this.injectJquery();
    // DEBUG
    var captchaSrc = this.page.evaluate(function() {
       return $('#recaptcha_image img').attr('src');
    });
    console.log("captchaSrc = "+captchaSrc)
    return captchaSrc;
}


TwitterAccountCreator.prototype.loadSignup = function(callback) {
    this.pageBefore();
    this.page.open(URL_SIGNUP, callback);
}


TwitterAccountCreator.prototype.validateAccountInfo = function() {
    if (this.userAccount.username.length > 15)
        this.userAccount.username = this.userAccount.username.slice(this.userAccount.username.length - 15, this.userAccount.username.length);
    this.userAccount.username.replace(".","");

}

TwitterAccountCreator.prototype.run = function(callback) {
    // Pass useraccount
    //this.user_account = account ? account : this.user_account;

    var par = this;

    this.validateAccountInfo();

    // Now load signup page
    var loadSignup = function() {
        console.log("Loading signup")
        par.loadSignup(twitterSignupPageLoaded);
    }
    
    var twitterSignupPageLoaded = function() {
            var captchaSrc = null;
            captchaSrc = par.extractCaptchaURL();

            if (!captchaSrc) {
                console.log('No Captcha!!!!');
                fillOutPage(par.page,par.userAccount);

            }
            else {
                solveCaptchaURL(captchaSrc);
            }
    }


    var solveCaptchaURL = function(captcha_url) {
      var url = "http://ifnseo.com:9999/dbc/solve_url?url=" + captcha_url;
     
      console.log('Solve url: ' + url);
        par.newFetcher = new mfetcherreg.Fetcher();
        par.newFetcher.buildPage();
        par.newpage = par.newFetcher.page;

        par.newpage.open(url, dbcResponse);
    }

    var fillOutPage = function(page,user) {
        console.log('here first: ' + page);
       var theUri = mutils.getURI(page);

       var baseuriprof = null; 

        var response = page.evaluate(function(user) {
            $('input.email-input').val(user.email);
            $('div.password input').val(user.password);
            $('div.username input').val(user.username);
            $('div.name input').val(user.name);

           $('div.sign-up-box input').click();
        },
           JSON.stringify(par.userAccount) );
      
         page.onLoadFinished = null;
        mutils.waitFor( function() {
            par.injectJquery();
            var baseuriprof = page.evaluate(function () {
               $('div.sign-up-box input').click();
               console.log(document.baseURI);
                return [document.baseURI,$('#recaptcha_image').length];
               });
            return (baseuriprof[0] != theUri) || baseuriprof[1] > 0 }, delayTheLast, 10000, 1000);
    };

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
   
    var fillCaptcha = function(captcha_result) {
           var theUri = mutils.getURI(par.page);

            par.injectJquery();
            //Have the Captcha
            par.page.evaluate(function(param) {
                $('#recaptcha_response_field').val(param);
                   $('div.sign-up-box input').click();
            }, '"' + decodeURIComponent(captcha_result.replace('\+',' ')) + '"');
            
            console.log('par in fill is ' + par);

            mutils.waitForWithParam( function(newpar) {
                newpar.injectJquery();
                var baseuriprof = newpar.page.evaluate(function () {
                   $('div.sign-up-box input').click();
                    return document.baseURI;
                   });
                return (baseuriprof != theUri)}, par, delayTheLast, 10000, 1000);
        }
    
    var enterCaptcha = function(captcha_result) {
        console.log("CAPTCHA = "+captcha_result);
        fillCaptcha(captcha_result);
        //par.fillFormSubmit();
    }
    
    var delayTheLast = function() {
        mutils.spinFor(nextThing,3000);
    }


    var nextThing = function() {
            par.injectJquery();
            var errormsg = par.page.evaluate(function () {
                return $('#recaptcha_image').length;
            });
           
            if (errormsg) // It has a recaptcha, so let's fill it out
                twitterRecaptchaSolver();
            else{
                console.log('Made it!');
    //            par.page.render('/var/www/html/fewdalism.com/phantomjs/newbeg.png');
                console.log(JSON.stringify(par.userAccount));
                finalize();
        }
 }

// This loads after the SignUp page has loaded
// This is where you would enter name, information for new account
// May or may not have Captcha

    var twitterRecaptchaSolver  = function() {
                            par.injectJquery();
                            // Isolate the Captcha from Yahoo for analyzing
                            var captchaSrc = null;
                            captchaSrc = par.extractCaptchaURL();
                            if (!captchaSrc) {
                                return;
                            }
                            solveCaptchaURL(captchaSrc);
                        }
    
    var finalize = function() {
        // Sucess
       var url = 'http://ifnseo.com:8088/twitter/add?profile_id='+par.seocortex_profile_id+'&jsondata=' + encodeURIComponent(JSON.stringify(par.userAccount));
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


    loadSignup();
}

var exports = exports || {};
// Exports
exports.TwitterAccountCreator = TwitterAccountCreator

