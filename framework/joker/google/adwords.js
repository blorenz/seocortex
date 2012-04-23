phantom.injectJs('joker/google/base.js');

var GoogleAdwords = function() {
    GoogleBase.apply(this);
};

GoogleAdwords.prototype = new GoogleBase();


GoogleAdwords.prototype.createAccount = function createAccount(that) {
    if (!that)  that = this;

    that.resetPageLoad();
    console.log('in create');
    that.setCurrentURI();
    that.injectJquery();
    that.screenshot('trythisfirst');
    that.page.evaluate(function() {$('a.g-button-red').click(); });

//    that.clickOnPage('a.g-button-red');
    that.waitForPageToChange(function() {that.login(that);});

    //mutils.spinFor(function() {that.login(that);},10000);
// $('iframe#newAccountLoginBox').contents().find('form#createaccount input:visible');  [0] email [1] & [2] password  [3] Captcha  [4] submit
// $('iframe#newAccountLoginBox').contents().find('form#createaccount img')[0]

// $('table.signup-answers select option[value="US"]').attr('selected','')
// $('table.signup-answers select')[1]; HARD CLICK, HARD CLICK + 50px on y;     option[value="America/New_York"]').attr('selected','')
// $('table.signup-answers select option[value="USD"]').attr('selected','')
//

};

GoogleAdwords.prototype.login = function login(that) {
    if (!that)  that = this;
    that.resetPageLoad();
    that.setCurrentURI();
    that.screenshot('trythis');
    that.injectJquery();
    that.page.evaluate( function() {$('#hasNoGoogleAccount').click(); } );
    //mutils.clickOnPage(that.page,'#hasNoGoogleAccount');

    mutils.spinFor(function() {that.login2(that);},10000);
};

GoogleAdwords.prototype.login2 = function login2(that) {
    if (!that)  that = this;
    that.resetPageLoad();
    console.log('done');
    that.screenshot('trythis22');

};

GoogleAdwords.prototype.run = function run() {
var par = this;
    par.setCurrentURI();

    par.page.open(URL_ADWORDS,function() {par.createAccount(par);});

};


// Exports
exports.GoogleAdwords = GoogleAdwords;

