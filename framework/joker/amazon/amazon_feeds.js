// Includes
var mutils = require('spooky/utils/utils');
var maccount = require('joker/yahoo/account');
var mfetcherreg = require('spooky/io/fetcher');
var mfetcher = require('joker/utils/proxied_fetcher');
var system = require('system');

var PATH_SCREENSHOTS = '/var/www/html/fewdalism.com/phantomjs/';

var URL_FEED_BASE = 'http://www.amazon.com/rss/tag/';

// Constructor
function AmazonFeedExtractor() {
    // Automagically proxied requests
    this.fetcher = new mfetcher.ProxiedFetcher();
    this.fetcher.buildPage();
    this.page = this.fetcher.page;
    this.page.viewportSize = { width: 1080, height: 1000 };

    this.pageBefore = function() { this.page.onLoadFinished = null };
    // Keep track of progress
    this.failed = false;
    this.userAccount = user_account ? user_account : new Object();
   
    this.feedContent = null;

    //DEBUG
    this.screenshotPath = PATH_SCREENSHOTS + mutils.randomInt() + '/';
    
    // FROM run()
}

AmazonFeedExtractor.prototype.getFeed(keyword, type, callback) {

    var url = this.getFeedURI(keyword, type);
    this.page.open(url, callback);
}

AmazonFeedExtractor.prototype.getFeedURI(keyword, type) {

    var fragment = null;
    switch (type) {
        case 0: fragment = '/popular/';
                break;
        case 1: fragment = '/new/';
                break;
        default:
                fragment = '/popular/';
                break;
    }

    var theLength = '?length=100';

    return URL_FEED_BASE + keyword + fragment + theLength;
}

AmazonFeedExtractor.prototype.getJSON(xml) {

    return mutils.xmlToJson(xml);
}

//console.log('PASSWORD IS ' + userAccount.password);

var done = false;

AmazonFeedExtractor.prototype.screenshot = function(filename) {
    mutils.screenshot(this.page,this.screenshotPath + filename + '.png');
}

AmazonFeedExtractor.prototype.injectJquery = function() {
    this.page.injectJs('web_js/jquery.js');
}


AmazonFeedExtractor.prototype.run = function(callback) {
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
        if (par.doTwitterActivation())
            mutils.spinFor(activateTwitter,3000);
    }

    var activateTwitter = function() {
        par.activateTwitter();
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
exports.AmazonFeedExtractor = AmazonFeedExtractor;



