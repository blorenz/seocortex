// Includes
var mdbc = require('joker/dbc/dbc');
var mnames = require('joker/names/names');

var page = require('webpage').create(),
    system = require('system');


// Consts
var URL_SIGNUP = 'http://www.twitter.com/signup';
var DEBUG_MODE = true;

function TwitterAccountCreator() {
    this.fetcher = new mfetcher.ProxiedFetcher();
    this.userAccount = new Object();
}


// Print usage message, if no address is passed
if (system.args.length < 5) {
    console.log("Usage: twitter_account_creator.js [email] [password] [full name] [username]"); 
    phantom.exit(1);
} else {
    //address = Array.prototype.slice.call(system.args, 1).join(' ');
    userAccount.email = system.args[1]; 
    userAccount.password = system.args[2]; 
    userAccount.fullname = system.args[3]; 
    userAccount.username = system.args[4]; 
    randomInteger = Math.floor( Math.random() * 1000000000);
}


var screenshot = function(page,file) {
  page.render('/var/www/html/fewdalism.com/phantomjs/'+file+'.png');
};

var done = false;
// Fills out the signup page
var fillOutPage = function(page,user) {
    if (DEBUG_MODE)
        console.log('fillOutPage----------------');
   var theUri = page.evaluate(function () {
       return document.baseURI; 
   });
   var baseuriprof = null; 

    var response = page.evaluate(function(user) {
        $('input.email-input').val(user.email);
        $('div.password input').val(user.password);
        $('div.username input').val(user.username);
        $('div.name input').val(user.fullname);

       // #captchaV5ClassicCaptchaImg
       // #captchaV5Answer
       $('div.sign-up-box input').click();
    },
       JSON.stringify(userAccount) );
  
    page.render('/var/www/html/fewdalism.com/phantomjs/screen_profile.png');
     page.onLoadFinished = null;
    waitFor( function() {
        if (DEBUG_MODE)
        console.log('The current uri: ' +theUri);
        baseuriprof = page.evaluate(function () {
            // Monitoring
           $('div.sign-up-box input').click();
           console.log(document.baseURI);
            return [document.baseURI,$('#recaptcha_image').length];
           });
        screenshot(page,'testingthis');
        return (baseuriprof[0] != theUri) || baseuriprof[1] > 0 }, delayTheLast, 10000, 1000);
};

var nextThing = function() {
    if (DEBUG_MODE)
        require('fs').write('/var/www/html/fewdalism.com/phantomjs/test.html',page.content,'w'); 
        screenshot(page,'urichanged');
        page.injectJs('jquery.js');
        var errormsg = page.evaluate(function () {
            return $('#recaptcha_image').length;
        });
       
        if (errormsg) // It has a recaptcha, so let's fill it out
            twitterRecaptchaSolver();
        else{
            console.log(JSON.stringify(userAccount));
            phantom.exit();}
    }

var dbcQuery = null;
var dbcPoll = null;
var dbcPage = null;
var baseuril = null;
var href = null;



var delayTheLast = function() {
    if (DEBUG_MODE)
    console.log('Delaying!');
    spinFor(nextThing,3000);
}

var delayThePage = function() {
    if (DEBUG_MODE)
    console.log('Delaying!');
    spinFor(yahooSignUpPageLoaded,3000);
}
// This loads after the SignUp page has loaded
// This is where you would enter name, information for new account
// May or may not have Captcha
var twitterSignupPageLoaded = function() {
    if (DEBUG_MODE)
        console.log('twitterSignupPageLoaded----------------');
                            page.injectJs('jquery.js');
                            // Isolate the Captcha from Yahoo for analyzing
                           var captchaPage = require('webpage').create();
                            captchaPage.setProxyAuth(proxy.u+':'+proxy.p);
                            captchaPage.setProxy(proxy.ip+':'+proxy.port);
                            captchaPage.applyProxy();
                            var captchaSrc = null;
                            captchaSrc = page.evaluate(function() {
                                                           return $('#recaptcha_image img').attr('src');
                                                       });
                            if (DEBUG_MODE)
                            console.log('Captcha src: ' + captchaSrc);
                            if (!captchaSrc) {
                                if (DEBUG_MODE)
                                console.log('No Captcha!!!!');
                                fillOutPage(page,userAccount);
                                return;
                            }
                            captchaPage.onLoadFinished = function (success) {
                                // NECESSARY!!! Render out the Captcha to a file
                                captchaPage.render(pathToTemp + '/captcha-'+randomInteger+'.png');
                                // Create new webpage for Death By Captcha
                                dbcPage = require('webpage').create();
                                baseuri = dbcPage.evaluate(function(){ return document.baseURI; });
                                dbcPage.injectJs('jquery.js');
                                dbcPage.injectJs('dbc_form.js');
                                dbcPage.uploadFile('#dbc_file',pathToTemp + '/captcha-'+randomInteger+'.png');
                                dbcPage.evaluate(function() {
                                    $('#dbc_username').val('coding.solo');
                                    $('#dbc_password').val('colonel1');
                                    $('form').submit();    
                                });

                                waitFor(function () {
                                    // Wait until Death By Captcha changes our baseURI to reflect the post redirect
                                    var dbcRes = dbcPage.evaluate(function(){ return document.baseURI; });
                                    return dbcRes != baseuri;
                                }, dbcAPIResponse,10000);
                           };

                           captchaPage.open(captchaSrc);
                        }

var twitterRecaptchaSolver  = function() {
    if (DEBUG_MODE)
        console.log('twitterRecaptchaSolver----------------');
                            page.injectJs('jquery.js');
                            // Isolate the Captcha from Yahoo for analyzing
                           var captchaPage = require('webpage').create();
                            captchaPage.setProxyAuth(proxy.u+':'+proxy.p);
                            captchaPage.setProxy(proxy.ip+':'+proxy.port);
                            captchaPage.applyProxy();
                            var captchaSrc = null;
                            captchaSrc = page.evaluate(function() {
                                                           return $('#recaptcha_image img').attr('src');
                                                       });
                            if (DEBUG_MODE)
                            console.log('Captcha src: ' + captchaSrc);
                            if (!captchaSrc) {
                                if (DEBUG_MODE)
                                console.log('No Captcha!!!!');
                                return;
                            }
                            captchaPage.onLoadFinished = function (success) {
                                // NECESSARY!!! Render out the Captcha to a file
                                captchaPage.render(pathToTemp + '/captcha-'+randomInteger+'.png');
                                // Create new webpage for Death By Captcha
                                dbcPage = require('webpage').create();
                                baseuri = dbcPage.evaluate(function(){ return document.baseURI; });
                                dbcPage.injectJs('jquery.js');
                                dbcPage.injectJs('dbc_form.js');
                                dbcPage.uploadFile('#dbc_file',pathToTemp + '/captcha-'+randomInteger+'.png');
                                dbcPage.evaluate(function() {
                                    $('#dbc_username').val('coding.solo');
                                    $('#dbc_password').val('colonel1');
                                    $('form').submit();    
                                });

                                waitFor(function () {
                                    // Wait until Death By Captcha changes our baseURI to reflect the post redirect
                                    var dbcRes = dbcPage.evaluate(function(){ return document.baseURI; });
                                    return dbcRes != baseuri;
                                }, dbcAPIResponse,10000);
                           };

                           captchaPage.open(captchaSrc);
                        }
var dbcAPIResponse = function() {
                                    // Ok, Death By Captcha has returned us a query string to poll for results
                                    dbcPage.injectJs('jquery.js');
                                    dbcPoll = dbcPage.evaluate(function() { return document.baseURI; });
                                    dbcQuery = dbcPage.evaluate(function() { return $('pre').text(); });
                                    // DEBUG ONLY
                                    // dbcPage.render('/var/www/html/fewdalism.com/phantomjs/dbc.png');
                                    if (DEBUG_MODE)
                                    console.log("DBC QUERY: " +dbcQuery);
                                    if (DEBUG_MODE)
                                    console.log("DBC POLL: " +dbcPoll);
                                    var captchaTest = require('webpage').create();
                                    var captcha = null;
                                    // Now poll Death By Captcha for the result
                                    waitFor(function() {
                                        captchaTest.onLoadFinished = function() {
                                            captchaTest.injectJs('jquery.js');
                                            dbcQuery = captchaTest.evaluate(function() { return $('pre').text(); });
                                            var re = /text=(.*)\&/;
                                            captcha = re.exec(dbcQuery)[1];
                                        };

                                        captchaTest.open(dbcPoll);
                                            return (captcha ? captcha.length > 0 : false); 

                                        },
                                        function() {
                                           var theUri = page.evaluate(function () {
                                                   return document.baseURI; 
                                               });
                                            //Have the Captcha
                                            if (DEBUG_MODE)
                                            console.log("Captcha is " + captcha);
                                            //phantom.exit();
                                            page.evaluate(function(param) {
                                                $('#recaptcha_response_field').val(param);
                                                   $('div.sign-up-box input').click();
                                            }, '"' + decodeURIComponent(captcha.replace('\+',' ')) + '"');
                                           // fillOutPage(page,userAccount);
                                            if (DEBUG_MODE)
                                            console.log('Did it with: ' + decodeURIComponent(captcha.replace('\+',' ')));
                                            waitFor( function() {
                                                if (DEBUG_MODE)
                                                console.log('The current uri: ' +theUri);
                                                baseuriprof = page.evaluate(function () {
                                                    // Monitoring again
                                                   $('div.sign-up-box input').click();
                                                   console.log(document.baseURI);
                                                    return [document.baseURI,$('#recaptcha_response_field').val()];
                                                   });
                                                screenshot(page,'testingthis-1');
                                                return (baseuriprof[0] != theUri)}, delayTheLast, 10000, 1000);
                                            
                                        },
                                        60000,
                                        3000);


}

// This is the __main__
page.onLoadFinished = function (status) {
    // Check for page load success
    if (status !== "success") {
        console.log("Unable to access network for first");
        phantom.exit(1);
    } else {
        page.injectJs('jquery.js');
            waitFor(function() {
                // Check in the page if a specific element is now visible
                var res = page.evaluate(function(param) {
                        return $('div.signup-wrapper').length > 0; 
                });
                return res;
            }, twitterSignupPageLoaded, 10000);        
        //phantom.exit();
    }
};
page.open(encodeURI(theUrl));
