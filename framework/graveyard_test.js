// Includes
mserver =  require('spooky/server/server')
mviews = require('spooky/views/base')

// Constructor
function OurView() {
	mviews.BaseView.call(this);
	this.content_type = 'application/json';
}
OurView.prototype = new mviews.BaseView();
OurView.prototype.constructor = OurView;


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

// Debug
var v = new OurView();
console.log(v['head']);

var s = new mserver.Server(8086, url_map)
s.run()
