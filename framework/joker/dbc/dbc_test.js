// Includes
var system = require('system');
var mstep = require('spooky/sync/step');
var mutils = require('spooky/utils/utils');
var msolver = require('joker/dbc/solver');

// Consts
var URL_SAMPLE = 'https://c5.ah.yahoo.com/img/ws_5qc4ZPB0rq_H3uzt1LdOta0vH2.Ee4LXR5YFlhnhXyFCLuvdIlK9FXP0VgicsVfYATCf_1JI9E.ZBbbLXkhrRQ26FfKxcpPUHHycatCO4ddvh1GpNiWl9f1EPXAZZer_6rnjf9Zl0W8552g-.jpg';
var FILE_SAMPLE = '/tmp/test_image.jpg';


var page = new WebPage();

// Go !
if(system.args.length < 2)
{
    console.log("Please enter a URL as first argument");
    phantom.exit();
}
var url = system.args[1];

// Testing
var solver = new msolver.DBCSolver('sample.jpg');
solver.solveURL(url, function(response) {
    console.log("RESPONSE = "+response);
    phantom.exit();
})