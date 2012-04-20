phantom.injectJs('joker/pinterest/base.js');

var PinterestLogin = function(user_account) {
    YahooBase.apply(this);

    // YahooEmailChecker specifics
    this.userAccount = user_account ? user_account : new Object();
}

PinterestLogin.prototype = new PinterestBase();


PinterestLogin.prototype.login = function () {
    // Here is the magic! new evaluate param takes a secondary argument.  ideally a JSON object, but a string for this purpose
    ret = page.evaluate( function(user) {
          $('#id_password').val(user.password);
          $('#id_email').val(user.name);
          $('form.Form').submit();
        },this.userAccount);
//
////
//  Verify here!!!!!  Verify here!!!!!  Verify here!!!!!  Verify here!!!!!  Verify here!!!!!
  //page.render('/var/www/html/fewdalism.com/phantomjs/screen2.png');
};

var userAccount = {
                    login: username,
                    password: password
};

PinterestLogin.prototype.run = function run() {

    var par = this;

    var loginLoaded = function (status) {
    // Check for page load success
    if (status !== "success") {
        console.log("Unable to access network");
    } else {
        par.login();
        waitFor(function() {
            // Check in the page if a specific element is now visible
            var res = page.evaluate(function(param) {
                    return $('li#UserNav a.nav').length > 0; 
            });
            return res;
        }, function() {
           console.log("You are logged in now.");
        }, 10000);        
        }
    }

    this.page.open(encodeURI(URL_LOGIN), loginLoaded);

};

