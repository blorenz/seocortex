// Includes
var mutils = require('spooky/utils/utils');
var mstep = require('spooky/sync/step');
var maccount = require('joker/yahoo/account');
var mfetcherreg = require('spooky/io/fetcher');
var mfetcher = require('joker/utils/proxied_fetcher');
var msolver = require('joker/dbc/solver');
var system = require('system');

var PATH_SCREENSHOTS = '/var/www/html/fewdalism.com/phantomjs/';

var URL_LOGIN = 'https://login.yahoo.com/config/login_verify2?.intl=us&.src=ym';

// Constructor
function YahooEmailChecker(mode,user_account) {
    // Automagically proxied requests
    this.fetcher = new mfetcher.ProxiedFetcher();
    this.fetcher.buildPage();
    this.page = this.fetcher.page;
    this.page.viewportSize = { width: 1080, height: 1000 };

    this.pageBefore = function() { this.page.onLoadFinished = null };
    // Keep track of progress
    this.failed = false;
    this.userAccount = user_account ? user_account : new Object();

    //DEBUG
    this.screenshotPath = PATH_SCREENSHOTS + mutils.randomInt() + '/';
    this.twitterActivationLink = null;
    this.twitterAccountInfo = null;

    this.mode = mode ? mode : 'activate-twitter';
    // FROM run()
}



//console.log('PASSWORD IS ' + userAccount.password);

var done = false;

YahooEmailChecker.prototype.screenshot = function(filename) {
    mutils.screenshot(this.page,this.screenshotPath + filename + '.png');
}

YahooEmailChecker.prototype.injectJquery = function() {
    this.page.injectJs('web_js/jquery.js');
}

YahooEmailChecker.prototype.loadLogin = function(callback) {
    this.pageBefore();
    this.page.open(URL_LOGIN, callback);
}

YahooEmailChecker.prototype.checkPinterest = function() {
    this.mailCenterLoaded();

    this.screenshot('boolio');

    //require('fs').write('/var/www/html/fewdalism.com/phantomjs/test.html',this.page.content,'w'); 

    var hasPinterest = this.page.evaluate(function() {
        var emails = $('.list-view-items div.flex :nth-child(2)');
        var twitterEmail = null;
        for (email = 0; email < emails.length; email++) {
            if (/Pinterest/.test($(emails[email]).text())) {
               return true; 
            }
        }
        return false;
    });
   
    if (!hasPinterest) {
        console.log('No Pinterest found');
        return false;
    }
    else {
        console.log('Pinterest was found!!!');
        return true;
    }
    
}

YahooEmailChecker.prototype.doTwitterActivation = function() {
     
    // Initiliaze it
    console.log('doTwitterActivation');
    this.mailCenterLoaded();

    var hasTwitterActivation = this.page.evaluate(function() {
        var emails = $('.list-view-items div.flex :nth-child(2)');
        var twitterEmail = null;
        for (email = 0; email < emails.length; email++) {
            if (/Confirm your Twitter account/.test($(emails[email]).text())) {
               return true; 
            }
        }
        return false;
    });
   
    if (!hasTwitterActivation) {
        this.screenshot('no-twitter-found');
        console.log('No Twitter found');
        return false;
    }

    var el = this.page.evaluate(function() {
        var emails = $('.list-view-items div.flex :nth-child(2)');
        var twitterEmail = null;
        for (email = 0; email < emails.length; email++) {
            if (/Confirm your Twitter account/.test($(emails[email]).text())) {
                twitterEmail = emails[email];
            }
        }
        return [$(twitterEmail).offset().left,$(twitterEmail).offset().top];
    });
    this.page.sendEvent('click',el[0],el[1]);
    return true;
}

YahooEmailChecker.prototype.activateTwitter = function() {
    this.twitterActivationLink = this.page.evaluate(function() {
        return $('div.message.content iframe:visible').contents().find('html p a').html();
    });
    console.log(this.twitterActivationLink);

    //Open Twitter and log in
    //and activate
};

YahooEmailChecker.prototype.setTwitterAccount= function(account) {
    this.twitterAccountInfo = account;
}

YahooEmailChecker.prototype.logInToTwitter = function() {
    this.injectJquery();
    var json = JSON.stringify(this.twitterAccountInfo);
    console.log(json);
    var theReturn = this.page.evaluate(function (theUser) {
        $('input.js-username-field').val(theUser.username);
        $('input.js-password-field').val(theUser.password);
        var offsets = $('.submit:nth-child(3)').offset();
        //return document.baseURI; 
        return [offsets.left,offsets.top];
    },json);

    /*var ret = this.page.evaluate(function (user) {
        $('input.js-username-field').val(user.username);
        $('input.js-password-field').val(user.password);
        var offsets = $('.submit:first').offset();
        return document.baseURI; 
    //    return [offsets.left(),offsets.top()];
        }, this.twitterAccountInfo);*/
        require('fs').write('/var/www/html/fewdalism.com/phantomjs/twitterLog.html',this.page.content,'w'); 

    this.screenshot('what-is-up');
    console.log('after evaluate');
    var selector = "#page-container .submit";
    this.page.sendEvent('click',theReturn[0],theReturn[1]);
}

YahooEmailChecker.prototype.mailCenterLoaded = function() {
    console.log('mailcenter');
    this.injectJquery();

    // Click on Inbox
   var selector = "#tabinbox b";
   console.log(this.page);
   mutils.clickOnPage(this.page,selector);
};

YahooEmailChecker.prototype.run = function(callback) {
    // Pass useraccount
    //this.user_account = account ? account : this.user_account;

    var par = this;
    // Go to homepage
    var loadLogin = function() {
        console.log("Loading homepage")
        console.log(JSON.stringify(par.user_account));
        par.loadLogin(yahooLoginPageLoaded);
    }

    var yahooLoginPageLoaded = function() {
                par.injectJquery();
                var loginuri = mutils.getURI(par.page); 

                var href = par.page.evaluate(function(user) {
                        $('#username').val(user.username); 
                        $('#passwd').val(user.password); 
                        $('#submit button').click();
                }, JSON.stringify(par.userAccount));
                
                mutils.waitForWithParam(function(newpar) {
                    // Check in the page if a specific element is now visible
                    var pageuri = mutils.getURI(newpar.page);
                    //console.log(loginuri);
                    //console.log(pageuri);
                    return loginuri != pageuri;
                }, par, delayThePage, 10000);        
        
    };

    var delayThePage = function() {
        console.log('Delaying the Page!');
        par.page.onLoadFinished = null;
       
        var modeFunc = null;

        switch (par.mode) {

            case 'activate-twitter': modeFunc = doTwitterActivation;
                                     break;
            
            case 'check-pinterest': modeFunc = checkPinterest;
                                     break;
            
            default: modeFunc = doTwitterActivation;
                     break;
        }

        mutils.spinFor(modeFunc,3000);


        //mutils.spinFor(doTwitterActivation,3000);
    }

    var checkPinterest = function() {
        par.checkPinterest();
    }

    var doTwitterActivation = function() {
        if (par.doTwitterActivation())
            mutils.spinFor(activateTwitter,3000);
    }

    var activateTwitter = function() {
        par.activateTwitter();

        par.page.open(par.twitterActivationLink, logInToTwitter);
    }

    var logInToTwitter = function() {
        par.page.onLoadFinished = null;
        console.log('Time to open'); 
        console.log(par.twitterAccountInfo.username);
        mutils.spinFor(loginLoadedForTwitter, 5000);
    }

    var loginLoadedForTwitter = function() {
        par.logInToTwitter();
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


    loadLogin();
}

var exports = exports || {};
// Exports
exports.YahooEmailChecker = YahooEmailChecker;



