// Includes
var mnames = require('joker/names/names');


// Constructor
function YahooAccount(first, last, yahooid, bday, byear, postcode, secret1, secret2) {
    this.firstname = first;
    this.lastname = last;
    this.yahooid = yahooid;
    this.birthday = bday;
    this.birthyear = byear;
    this.postalcode = postcode;
    this.secquestionanswer = secret1;
    this.secquestionanswer2 = secret2;
}; 



// Builds a random reasonable looking account
var buildRandomAccount = function(password) {
    var first = mnames.random_first();
    var last = mnames.random_last();
    password = password ? password : mutils.randomString(16);
    var secret1 = names.random_city();
    var secret2 = names.random_animal();
    var yahooid = first+"."+last+randomInt(100);
    var bday: randomInt(30) + 1;
    var byear: randomInt(27)+1965;
    // Should change this
    var postcode = '90210';

    var obj = new YahooAccount(first, last)
    return obj;
}


// Exports
exports.YahooAccount = YahooAccount
exports.buildRandomAccount = buildRandomAccount