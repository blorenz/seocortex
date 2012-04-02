// Includes
var page = require('webpage');
var system = require('system');
var mutils = require('spooky/utils/utils');
var maccount = require('joker/yahoo/account');
var mfetcher = require('joker/utils/proxied_fetcher');

// Consts
var URL_HOMEPAGE = 'http://www.yahoo.com';
var URL_SIGNUP = 'https://edit.yahoo.com/registration?.src=fpctx&.intl=us&.done=http://www.yahoo.com/';

var BuilderStates = {
    HOMEPAGE : 0,
    SIGNUP : 1,
    // Need to finish this to have a nice evented loop
}


// Constructor
function YahooAccountBuilder() {
    // Automagically proxied requests
    this.fetcher = mfetcher.ProxiedFetcher;
    this.fetcher.build_page();
    this.page = this.fetcher.page;
    this.user_account = maccount.buildRandomAccount();

    // Keep track of progress
    this.completed = false;
}



// Methods
YahooAccountBuilder.prototype.loadHomepage = function() {
    var res = this.fetcher.blockingFetch(URL_HOMEPAGE);
    return res;
}

YahooAccountBuilder.prototype.loadSignup = function() {
    var res = this.fetcher.blockingFetch(URL_SIGNUP);
}

YahooAccountBuilder.prototype.onCompleted = function() {
    console.log(JSON.stringify(this.user_account));
}

YahooAccountBuilder.prototype.hasCaptchaFailed = function() {
    page.injectJs('jquery.js');
    var errormsg = page.evaluate(function () {
        return $('#captchaFldMsg').text();
    });
    return !errormsg;
}


YahooAccountBuilder.prototype.getCaptcha = function() {
    return captcha_data;
}


YahooAccountBuilder.prototype.fillInPage = function(user_account, callback) {
    user_account = user_account ? user_account : this.user_account;

    // Fomm in all the data
    var response = page.evaluate(function(user) {
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
        $('#secquestionanswer').val(user.secquestionanswer);
        $('#secquestion2 option[value="Where did you spend your childhood summers?"]').attr("selected", "selected");
        $('#secquestionanswer2').val(user.secquestionanswer2);
        $('#language option[value="en-US"]').attr("selected", "selected");

        // Submit form
        $('#IAgreeBtn').click();
    },
        JSON.stringify(user_account)
    );
  
    this.page.onLoadFinished = null;
    waitFor( function() {
        baseuriprof = this.page.evaluate(function () {
            // Monitoring
           //console.log(document.baseURI);
           return [document.baseURI,document.querySelector('#regConfirmBody') ? 1 : 0]; 
           });
        return (baseuriprof[0] != theUri) || baseuriprof[1];}, callback, 10000);
}



YahooAccountBuilder.prototype.run = function(on_completed) {
    this.onCompleted = on_completed ? on_completed : this.onCompleted;

    // Step 1    
}

var nextThing = function() {
        //console.log('URI CHANGED to '+baseuriprof+'!!!!!!!!!!!!');
        require('fs').write('/var/www/html/fewdalism.com/phantomjs/test.html',page.content,'w'); 
        screenshot(page,'urichanged');
        page.injectJs('jquery.js');
        var errormsg = page.evaluate(function () {
            return $('#captchaFldMsg').text();
        });
       
        if (errormsg)
            yahooSignUpPageLoaded();
        else{
            console.log(JSON.stringify(userAccount));
            phantom.exit();}
    }

var yahooLoginPageLoaded = function() {
                href = page.evaluate(function() {
                    return $('#signUpBtn').attr('href');
                });
                //console.log(href);            
                page.onLoadFinished = function (status) {
                    // Check for page load success
                    screenshot(page,'firsttime');
                    if (status !== "success") {
                        console.log("Unable to access network to signup");
                        phantom.exit(1);
                    } else {
                        page.injectJs('jquery.js');
                        waitFor(function() {
                            // Check in the page if a specific element is now visible
                            var res = page.evaluate(function(param) {
                                    return $('#firstname').length > 0; 
                            });
                            return res;
                        }, delayThePage, 10000);        


                    }
                };
                page.open(encodeURI(href));

                
};

var delayTheLast = function() {
    //console.log('Delaying!');
    spinFor(nextThing,3000);
}

var delayThePage = function() {
    //console.log('Delaying!');
    spinFor(yahooSignUpPageLoaded,3000);
}
// This loads after the SignUp page has loaded
// This is where you would enter name, information for new account
// May or may not have Captcha
var yahooSignUpPageLoaded = function() {
                            screenshot(page,'doit');
                            page.injectJs('jquery.js');
                            // Isolate the Captcha from Yahoo for analyzing
                           var captchaPage = require('webpage').create();
                            captchaPage.setProxyAuth(proxy.u+':'+proxy.p);
                            captchaPage.setProxy(proxy.ip+':'+proxy.port);
                            captchaPage.applyProxy();
                            var captchaSrc = null;
                            captchaSrc = page.evaluate(function() {
                                                           return $('#captchaV5ClassicCaptchaImg').attr('src');
                                                       });
                            //console.log('Captcha src: ' + captchaSrc);
                            if (!captchaSrc) {
                                //console.log('No Captcha!!!!');
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

var dbcAPIResponse = function() {
                                    // Ok, Death By Captcha has returned us a query string to poll for results
                                    dbcPage.injectJs('jquery.js');
                                    dbcPoll = dbcPage.evaluate(function() { return document.baseURI; });
                                    dbcQuery = dbcPage.evaluate(function() { return $('pre').text(); });
                                    // DEBUG ONLY
                                    // dbcPage.render('/var/www/html/fewdalism.com/phantomjs/dbc.png');
                                    //console.log("DBC QUERY: " +dbcQuery);
                                    //console.log("DBC POLL: " +dbcPoll);
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
                                            //Have the Captcha
                                            //console.log("Captcha is " + captcha);
                                            //phantom.exit();
                                            page.evaluate(function(param) {
                                                $('#captchaV5Answer').val(param);
                                            }, '"' + captcha + '"');
                                            fillOutPage(page,userAccount);
                                            
                                        },
                                        60000,
                                        3000);


}
