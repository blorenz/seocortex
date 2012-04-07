// Includes
var mutils = require('spooky/utils/utils');
var mnames = require('joker/names/names');


// Constructor
function YahooAccount(first, last, yahooid, password, bmonth, bday, byear, postcode, secret1, secret2) {
    this.firstname = first;
    this.lastname = last;
    this.yahooid = yahooid;
    this.password = password;
    this.birthmonth = bmonth;
    this.birthday = bday;
    this.birthyear = byear;
    this.postalcode = postcode;
    this.secret1 = secret1;
    this.secret2 = secret2;
} 



// Builds a random reasonable looking account
var buildRandomAccount = function(password) {
    var first = mnames.randomFirst();
    var last = mnames.randomLast();
    password = password ? password : mutils.randomString(16);
    var secret1 = mnames.randomCity();
    //var secret2 = mnames.randomAnimal();
    var secret2 = mnames.randomCity();
    var joiner = mutils.randomInt(100) < 75 ? '' : '.';
    var yahooid = first+ joiner +last+mutils.randomInt(9000);
    var bmonth = mutils.randomInt(11) + 1;
    var bday = mutils.randomInt(30) + 1;
    var byear = mutils.randomInt(27)+1965;
    // Should change this
    var postcode = '90210';

    var obj = new YahooAccount(first, last, yahooid, password, bmonth, bday, byear, postcode, secret1, secret2);
    return obj;
}


// Exports
exports.YahooAccount = YahooAccount
exports.buildRandomAccount = buildRandomAccount
