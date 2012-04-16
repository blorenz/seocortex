var mtwitt = require('joker/twitter/twitter_account_creator');

var system = require('system'),
    page = require('webpage');


var twit = new mtwitt.TwitterAccountCreator();



var afterLoad = function afterLoad() {
   
    page.injectJs('web_js/jquery.js');
    var arr = JSON.parse(page.evaluate(function() { return $('pre').text(); }));
    twit.userAccount = { email: arr[0].yahooid+'@yahoo.com', 
                         password: arr[0].password,
                         fullname: arr[0].firstname + ' ' + arr[0].lastname,
                         username: arr[0].yahooid 
    };
    twit.run();
};
           
page.open('http://ifnseo.com:8088/joker/yahoo/list?amount=1&twitter=false',afterLoad);
