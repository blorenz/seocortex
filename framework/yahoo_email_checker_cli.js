var myahoo = require('joker/yahoo/yahoo_email_checker');

var system = require('system');


// Print usage message, if no address is passed
if (system.args.length < 3) {
    console.log("Usage: yahoo_email_checker_cli.js [mode] [username] [password] [twitter username] [twitter password]");
    phantom.exit(1);
} else {
    //address = Array.prototype.slice.call(system.args, 1).join(' ');
    mode = system.args[1];
    username = system.args[2];
    password = system.args[3];
    twitterUsername = system.args[4];
    twitterPassword = system.args[5];
}

var userAccount = {
    username: username,
    password: password
};

var testyab = new myahoo.YahooEmailChecker(mode);
testyab.userAccount = {
    username: username,
    password: password
};
testyab.setTwitterAccount({ username: twitterUsername, password: twitterPassword});
testyab.run();
