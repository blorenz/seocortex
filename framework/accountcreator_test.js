// Includes
var mcreator = require('joker/yahoo/yahoo_email_creator');


// Main
var creator = new mcreator.YahooAccountBuilder();
creator.run(function(account) {

    var json = JSON.stringify(account);
    console.log("ACCOUNT = "+json);
    phantom.exit();
}) 
