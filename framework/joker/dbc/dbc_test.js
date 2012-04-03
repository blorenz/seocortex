// Includes
var mstep = require('spooky/sync/step');
var mutils = require('spooky/utils/utils');
var msolver = require('joker/dbc/solver');

// Consts
var URL_SAMPLE = 'http://wakka.xiffy.nl/_media/captcha-sample.jpg';


var page = new WebPage();

// Go !
page.open(URL_SAMPLE, function() {

    var image_data = page.content;
    var solver = new msolver.DBCSolver()
    solver.solveData(image_data, function(response) {
        console.log("RESPONSE = "+response);
    })
})