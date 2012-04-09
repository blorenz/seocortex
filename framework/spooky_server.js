// Includes
mserver =  require('spooky/server/server')
mviews = require('spooky/views/base')

// Change this later
myahoo = require('joker/yahoo/yahoo_email_creator')
mtwitter = require('joker/twitter/twitter_account_creator')

// Constructor
function YahooAccountCreatorView() {
	mviews.BaseView.call(this);
	this.content_type = 'application/json';
}
YahooAccountCreatorView.prototype = new mviews.BaseView();
YahooAccountCreatorView.prototype.constructor = YahooAccountCreatorView;



// Methods
YahooAccountCreatorView.prototype.get = function(request, response) {
    console.log('routed');
    var data = {"success": "true"};

    var yac = new myahoo.YahooAccountBuilder();
    
    yac.run();

	response.write(JSON.stringify(data));
	response.close();
}


// Constructor
function TwitterAccountCreatorView() {
    mviews.BaseView.call(this);
    this.content_type = 'application/json';
}
TwitterAccountCreatorView.prototype = new mviews.BaseView();
TwitterAccountCreatorView.prototype.constructor = TwitterAccountCreatorView;



// Methods
TwitterAccountCreatorView.prototype.get = function(request, response) {
    console.log('routed');
    var json = request.GET['json'];
    var success = false;
    var data = {}

    // Get user account from
    if(json) {
        try {
            // [email] [password] [fullname] [username]
            var user_account = JSON.parse(json);
            var tac = new mtwitter.TwitterAccountCreator(user_account);
            tac.run();
            success = true;
        } catch(error) {
            success = false;
        }
    }

    data.success = success
    response.write(JSON.stringify(data));
    response.close();
}


// Testing
var url_map = {
    "^/yahoo" : YahooAccountCreatorView,
    "^/twitter" : TwitterAccountCreatorView,
}

// Debug
var s = new mserver.Server(8086, url_map)
s.run()
