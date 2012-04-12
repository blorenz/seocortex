phantom.injectJs('joker/pinterest/base.js');

var PinterestLogin = function(mode,user_account) {
    YahooBase.apply(this);

    // YahooEmailChecker specifics
    this.userAccount = user_account ? user_account : new Object();
    this.twitterActivationLink = null;
    this.twitterAccountInfo = null;
}

PinterestLogin.prototype = new PinterestBase();


var login = function (page,l,p) {
    var command = "$('#id_email').val('"+l+"');";

    // Here is the magic! new evaluate param takes a secondary argument.  ideally a JSON object, but a string for this purpose
    ret = page.evaluate( function(param) {
            eval(param);
          $('#id_password').val(user.password);
          $('#id_email').val(user.name);
          $('form.Form').submit();
        },'user={name:"'+l+'",password:"'+p+'"}');
//
////
//  Verify here!!!!!  Verify here!!!!!  Verify here!!!!!  Verify here!!!!!  Verify here!!!!!
  //page.render('/var/www/html/fewdalism.com/phantomjs/screen2.png');
};

var theUrl = 'http://www.pinterest.com/login';

var userAccount = {
                    login: username,
                    password: password
};

page.open(encodeURI(theUrl), function (status) {
    // Check for page load success
    if (status !== "success") {
        console.log("Unable to access network");
    } else {
        //
        //
        //
        // Execute some DOM inspection within the page context
        //page.render('/var/www/html/fewdalism.com/phantomjs/screen1.png');
        login(page, userAccount.login, userAccount.password);
        waitFor(function() {
            // Check in the page if a specific element is now visible
            var res = page.evaluate(function(param) {
                    return $('li#UserNav a.nav').length > 0; 
            });
            return res;
        }, function() {
           console.log("You are logged in now.");
           phantom.exit();
        }, 10000);        


    }
});
