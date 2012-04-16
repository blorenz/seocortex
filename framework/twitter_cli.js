var mtwitt = require('joker/twitter/twitter_account_creator');

var system = require('system'),
    page = require('webpage').create();





var afterLoad = function afterLoad() {

    console.log(page.content);
    page.injectJs('web_js/jquery.js');
    var arr = JSON.parse(page.evaluate(function() { return $('pre').text(); }));
    for (var key in arr[0]) {
            console.log(key);
    }
    userAccount = { email: arr[0].accounts.yahoo.yahooid+'@yahoo.com', 
                         password: arr[0].accounts.yahoo.password,
                         fullname: arr[0].accounts.yahoo.firstname + ' ' + arr[0].accounts.yahoo.lastname,
                         username: arr[0].accounts.yahoo.yahooid 
    };
    twit = new mtwitt.TwitterAccountCreator(arr[0]._id,userAccount);
    twit.run();
};
           
page.open('http://ifnseo.com:8088/joker/yahoo/list?amount=1&twitter=false',afterLoad);
