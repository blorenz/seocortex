var mbhw = require('joker/bhw/thread');

var system = require('system');


// Print usage message, if no address is passed
if (system.args.length < 2) {
    console.log("Usage: bhw_thread_cli.js [url]");
    phantom.exit(1);
} else {
    //address = Array.prototype.slice.call(system.args, 1).join(' ');
    url = system.args[1];
}


var testyab = new mbhw.BHWThread(url);
testyab.run();

