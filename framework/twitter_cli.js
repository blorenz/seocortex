var mtwitt = require('joker/twitter/twitter_account_creator');

var system = require('system');


var twit = new mtwitt.TwitterAccountCreator();

twit.userAccount = { email: system.args[1], 
                     password: system.args[2],
                     fullname: system.args[3],
                     username: system.args[4]
};

twit.run();
                    
