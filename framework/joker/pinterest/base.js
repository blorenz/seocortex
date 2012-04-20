// Includes
var mutils = require('spooky/utils/utils');
var mstep = require('spooky/sync/step');
var maccount = require('joker/yahoo/account');
var mfetcherreg = require('spooky/io/fetcher');
var mfetcher = require('joker/utils/proxied_fetcher');
var msolver = require('joker/dbc/solver');

// Consts
var URL_HOMEPAGE = 'http://www.pinterest.com';
var PATH_SCREENSHOTS = '/var/www/html/fewdalism.com/phantomjs/';
var URL_LOGIN = 'https://pinterest.com/login/?next=%2F'; 
var URL_INVITE = 'http://pinterest.com/invites/email/';

// Constructor
var PinterestBase = function() {
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
}


PinterestBase.prototype.screenshot = function(filename) {
    console.log('done screen');
    mutils.screenshot(this.page,this.screenshotPath + filename + '.png');
}

PinterestBase.prototype.injectJquery = function() {
    this.page.injectJs('web_js/jquery.js');
}

PinterestBase.prototype.loadHomepage = function(callback) {
    this.pageBefore();
    this.page.open(URL_HOMEPAGE, callback);
}

PinterestBase.prototype.loadSignup = function(callback) {
    this.pageBefore();
    this.page.open(URL_SIGNUP, callback);
}

PinterestBase.prototype.loadLogin = function(callback) {
    this.pageBefore();
    this.page.open(URL_LOGIN, callback);
}

PinterestBase.prototype.setCurrentURI = function() {
    this.currentURI = mutils.getURI(this.page);
}

PinterestBase.prototype.waitForPageToChange = function(callback) {
    mutils.waitForWithParam( function(param) {
        return document.baseURI != param;
    }, this.currentURI, callback, 10000); 

};

// What needs to be overwritten

PinterestBase.prototype.run = function(callback) {
    throw new Error("This method must be overwritten!");
}


