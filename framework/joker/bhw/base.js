phantom.injectJs('joker/common/base.js');


// Consts
var URL_HOMEPAGE = 'http://www.blackhatworld.com';
var PATH_SCREENSHOTS = '/var/www/html/fewdalism.com/phantomjs/';
var URL_LOGIN = 'https://blackhatworld.com/login/?next=%2F'; 
var URL_INVITE = 'http://blackhatworld.com/invites/email/';


var BHWBase = function() {
    Base.apply(this);
};

BHWBase.prototype = new Base();
