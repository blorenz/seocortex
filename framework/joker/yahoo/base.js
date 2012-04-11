// Includes
var mutils = require('spooky/utils/utils');
var mstep = require('spooky/sync/step');
var maccount = require('joker/yahoo/account');
var mfetcherreg = require('spooky/io/fetcher');
var mfetcher = require('joker/utils/proxied_fetcher');
var msolver = require('joker/dbc/solver');

// Consts
var URL_HOMEPAGE = 'http://www.yahoo.com';
var URL_SIGNUP = 'https://edit.yahoo.com/registration?.src=fpctx&.intl=us&.done=http://www.yahoo.com/';
var PATH_SCREENSHOTS = '/var/www/html/fewdalism.com/phantomjs/';
var URL_LOGIN = 'https://login.yahoo.com/config/login_verify2?.intl=us&.src=ym';

// Constructor
var YahooBase = function() {
    // Automagically proxied requests
    this.fetcher = new mfetcher.ProxiedFetcher();
    this.fetcher.buildPage();
    this.page = this.fetcher.page;
    this.page.viewportSize = { width: 1080, height: 1000 };
    this.user_account = maccount.buildRandomAccount();

    this.pageBefore = function() { this.page.onLoadFinished = null };
    // Keep track of progress
    this.failed = false;
    

    //DEBUG
    this.screenshotPath = PATH_SCREENSHOTS + mutils.randomInt() + '/';
    
    // FROM run()

    this.captcha_url = this;
    this.captcha_result = null;
    this.newFetcher = null;
    this.newpage = null;
}

YahooBase.prototype.screenshot = function(filename) {
    mutils.screenshot(this.page,this.screenshotPath + filename + '.png');
}

YahooBase.prototype.injectJquery = function() {
    this.page.injectJs('web_js/jquery.js');
}

YahooBase.prototype.loadHomepage = function(callback) {
    this.pageBefore();
    this.page.open(URL_HOMEPAGE, callback);
}

YahooBase.prototype.loadSignup = function(callback) {
    this.pageBefore();
    this.page.open(URL_SIGNUP, callback);
}

YahooBase.prototype.loadLogin = function(callback) {
    this.pageBefore();
    this.page.open(URL_LOGIN, callback);
}


// What needs to be overwritten

YahooBase.prototype.run = function(callback) {
    throw new Error("This method must be overwritten!");
}

