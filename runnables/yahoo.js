// Includes
var myahoo_email_creator = require('joker/yahoo/email_creator')

    
var checkMode = function(mode) {

    switch (mode) {

        case 'createaccount':
        case 'ca'
            break;

        case 'checkemail':
        case 'cem':
            break;

        default:
            console.log('Not a valid mode');
        //    phantom.exit();
            break;
    }
};
