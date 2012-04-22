var mgoogle = require('joker/google/adwords');

var system = require('system');


// Print usage message, if no address is passed
if (system.args.length < 2) {
    console.log("Usage: google_adwords_cli.js [username] [password]");
    phantom.exit(1);
} else {
    //address = Array.prototype.slice.call(system.args, 1).join(' ');
    username = system.args[1];
    password = system.args[2];
}

var testyab = new mgoogle.GoogleAdwords();
testyab.run();

