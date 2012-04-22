phantom.injectJs('web_js/jquery.js');
// Includes
var mutils = require('spooky/utils/utils');
var mstep = require('spooky/sync/step');
var maccount = require('joker/yahoo/account');
var mfetcherreg = require('spooky/io/fetcher');
var mfetcher = require('joker/utils/proxied_fetcher');
var msolver = require('joker/dbc/solver');

var exports = exports || {};

// Constructor
var Base = function() {
    // Automagically proxied requests
    this.fetcher = new mfetcher.ProxiedFetcher();
    this.fetcher.buildPage();
    this.page = this.fetcher.page;
    this.page.viewportSize = { width: 1080, height: 1000 };
    this.user_account = maccount.buildRandomAccount();

    this.pageBefore = function() { this.page.onLoadFinished = null };
    // Keep track of progress
    this.failed = false;
    
    this.currentURI = null;
    //DEBUG
    this.screenshotPath = PATH_SCREENSHOTS + mutils.randomInt() + '/';
    
    // FROM run()

    this.captcha_url = this;
    this.captcha_result = null;
    this.newFetcher = null;
    this.newpage = null;
    this.page.onConsoleMessage = function(msg) {
        console.log(msg);
    };
}


Base.prototype.screenshot = function(filename) {
    mutils.screenshot(this.page,this.screenshotPath + filename + '.png');
}

Base.prototype.injectJquery = function() {
    this.page.injectJs('web_js/jquery.js');
}

Base.prototype.loadHomepage = function(callback) {
    this.pageBefore();
    this.page.open(URL_HOMEPAGE, callback);
}

Base.prototype.loadSignup = function(callback) {
    this.pageBefore();
    this.page.open(URL_SIGNUP, callback);
}

Base.prototype.clickOnPage = function(selector) {
    mutils.clickOnPage(this.page,selector);
}

Base.prototype.loadLogin = function(callback) {
    this.pageBefore();
    this.page.open(URL_LOGIN, callback);
}

Base.prototype.setCurrentURI = function() {
    //console.log('before: ' + this.currentURI);
    this.currentURI = mutils.getURI(this.page);
    //console.log('after: ' + this.currentURI);
}

Base.prototype.resetPageLoad = function() {
    this.page.onLoadFinished = null;

};

Base.prototype.waitForPageToChange = function(callback) {
    mutils.waitForWithParam( function(param) {
        var href = param[0].evaluate( function () { return document.location.href; });
        //console.log('here it is: ' + href);
        //console.log('versus: ' + param[1]);
        return href != param[1];
    }, [this.page,this.currentURI], callback, 10000); 

};

// What needs to be overwritten

Base.prototype.run = function(callback) {
    throw new Error("This method must be overwritten!");
}

