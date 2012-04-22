phantom.injectJs('joker/common/base.js');


// Consts
var URL_HOMEPAGE = 'http://www.google.com';
var PATH_SCREENSHOTS = '/var/www/html/fewdalism.com/phantomjs/';
var URL_ADWORDS = 'http://adwords.google.com';

var GoogleBase = function() {
    Base.apply(this);
};

GoogleBase.prototype = new Base();

