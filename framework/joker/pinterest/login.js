// Get weather info for given address (or for the default one, "Mountain View")

function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 250); //< repeat check every 250ms
};

var page = require('webpage').create(),
    system = require('system');

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

// Print usage message, if no address is passed
if (system.args.length < 3) {
    console.log("Usage: pinterest_login.js [login] [password]");
    phantom.exit(1);
} else {
    //address = Array.prototype.slice.call(system.args, 1).join(' ');
    username = system.args[1];
    password = system.args[2];
}


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
