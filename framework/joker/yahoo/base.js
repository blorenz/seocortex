phantom.injectJs('joker/common/base.js');

// Consts
var URL_HOMEPAGE = 'http://www.yahoo.com';
var URL_SIGNUP = 'https://edit.yahoo.com/registration?.src=fpctx&.intl=us&.done=http://www.yahoo.com/';
var PATH_SCREENSHOTS = '/var/www/html/fewdalism.com/phantomjs/';
var URL_LOGIN = 'https://login.yahoo.com/config/login_verify2?.intl=us&.src=ym';

var YahooBase = function() {
    Base.apply(this);
};

YahooBase.prototype = new Base();
