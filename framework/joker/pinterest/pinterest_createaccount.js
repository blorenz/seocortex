var mutils = require('spooky/utils/utils');



var page = require('webpage').create(),
    system = require('system');

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

// Print usage message, if no address is passed
if (system.args.length < 4) {
    console.log("Usage: pinterest_createaccount.js [username] [email] [password]");
    phantom.exit(1);
} else {
    //address = Array.prototype.slice.call(system.args, 1).join(' ');
    username = system.args[2];
    password = system.args[3];
    profilename = system.args[1];
}


var login = function (page,l,p,u) {
    // Here is the magic! new evaluate param takes a secondary argument.  ideally a JSON object, but a string for this purpose
    ret = page.evaluate( function(param) {
            eval(param);
          $('#id_password').val(user.password);
          $('#id_email').val(user.name);
          $('#id_username').val(user.profilename);
          $('form.CompleteAccount').submit();
        },'user={name:"'+l+'",password:"'+p+'",username:"'+u+'"}');
//
////
//  Verify here!!!!!  Verify here!!!!!  Verify here!!!!!  Verify here!!!!!  Verify here!!!!!
  //page.render('/var/www/html/fewdalism.com/phantomjs/screen2.png');
};

var theUrl = 'http://www.pinterest.com/login';

var userAccount = {
                    login: username,
                    password: password,
                    profilename: profilename
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
        login(page, userAccount.login, userAccount.password, userAccount.profilename);
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
