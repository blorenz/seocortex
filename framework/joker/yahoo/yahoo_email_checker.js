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
function YahooEmailChecker(user_account) {
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
    mutils.spinFor(activateTwitter,3000);
}

YahooEmailChecker.prototype.activateTwitter = function() {
    var ret = this.page.evaluate(function() {
        return $('div.message.content iframe:visible').contents().find('html p a').html();
    });
    console.log(ret);
};

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
        console.log(par);
        mutils.spinFor(doTwitterActivation,3000);
    }

    var doTwitterActivation = function() {
        par.doTwitterActivation();
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

// Print usage message, if no address is passed
if (system.args.length < 3) {
    console.log("Usage: yahoo_email_creator.js [username] [password]");
    phantom.exit(1);
} else {
    //address = Array.prototype.slice.call(system.args, 1).join(' ');
    username = system.args[1];
    password = system.args[2];
}

var userAccount = {
    username: username,
    password: password
};

var testyab = new YahooEmailChecker();
testyab.userAccount = {
    username: username,
    password: password
};
testyab.run();


