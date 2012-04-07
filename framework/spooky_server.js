// Includes
mserver =  require('spooky/server/server')
mviews = require('spooky/views/base')

// Change this later
myahoo = require('joker/yahoo/yahoo_email_creator')

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



// Testing
var url_map = {
    "^/yahoo" : YahooAccountCreatorView,
}

// Debug
var s = new mserver.Server(8086, url_map)
s.run()
