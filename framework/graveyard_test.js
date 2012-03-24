// Includes
mserver =  require('graveyard/server/server')
mviews = require('graveyard/views/base')

// Constructor
OurView.prototype = new mviews.BaseView();
OurView.prototype.constructor = OurView;
function OurView() {
	mviews.BaseView.call(this);
	this.content_type = 'application/json';
}

// Methods
OurView.prototype.get = function(request, response) {
	var data = {"PhanthomJS" : "is good", "SEOCortex" : "is nice", "PiDigits" : [3,1,4,1]};
	response.write(JSON.stringify(data));
	response.close();
}

// Testing
var url_map = {
    "^/magic" : new OurView()
}

var s = new mserver.Server(8086, url_map)
s.run()
