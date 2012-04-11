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
   
    this.feedContent = null;

    //DEBUG
    this.screenshotPath = PATH_SCREENSHOTS + mutils.randomInt() + '/';
    
    // FROM run()
}

AmazonFeedExtractor.prototype.getFeed = function(keyword, type, callback) {
    console.log('going for it!');
    var url = this.getFeedURI(keyword, type);
    console.log(url);
    this.page.open(url, callback);
}

AmazonFeedExtractor.prototype.getFeedURI = function(keyword, type) {

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

AmazonFeedExtractor.prototype.getJSON = function(xml) {

    console.log('getting it');
    console.log(xml);
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

    
    var nextIt = function() {
        console.log('here now!');
        console.log(par.getJSON(par.page.content));
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

    console.log('Try it please');

    par.getFeed('vacuums',0, nextIt);

}

var exports = exports || {};
// Exports
exports.AmazonFeedExtractor = AmazonFeedExtractor;

console.log('gonna start');
var afe = new AmazonFeedExtractor();
afe.run();
