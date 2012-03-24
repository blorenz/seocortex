// Includes
var webserver, webpage;
webserver = require('webserver');
webpage = require('webpage');

var DEFAULT_PORT = 8086;
var DEAULT_ERROR_MSG = 'Something went wrong, Graveyard could not handle this request';
var DEFAULT_ERROR_CODE = 500;

function Server(port = DEFAULT_PORT, urlmap = {}) {  
    this._server = webserver.create();
    this._port = port;
    this._urlmap = urlmap;
}

// Methods
Server.prototype.run = function() {
    return this._server.listen(this._port, this.handle_request);
}

Server.prototype.error_handler = function(request, response, msg = DEAULT_ERROR_MSG, code = DEAULT_ERROR_CODE) {
    response.statusCode = code;
    response.write('<html><body>');
    response.write('<p>' + msg + '</p>');
    response.write('</body></html>');
    response.close();
}

Server.prototype.handler_404 = function(request, response) {
    var msg = 'Error 404 : Could not find a controller for : "'+ request.url +'". :('
    this.error_handler(request, response, msg, 404);
}

Server.prototype.handle_request = function(request, response) {
    for(var regex in this._urlmap)
    {
        // URL Matches regex
        if(regex.test(request.url))
        {
            return this._urlmap[regex](request, response);
        }
    }

}


/* Code inspired on, dump soon */ 
var getPage = function(response) {


var page = require('webpage').create(),
    url = 'http://lite.yelp.com/search?find_desc=pizza&find_loc=43068&find_submit=Search';
    var res = null;
    page.onLoadFinished = function (status) {
        if (status !== 'success') {
            console.log('Unable to access network');
        } else {
            var results = page.evaluate(function() {
                var list = document.querySelectorAll('span.address'), pizza = [], i;
                for (i = 0; i < list.length; i++) {
                    pizza.push(list[i].innerText);
                }
                return pizza;
            });
            res = results;
        response.statusCode = 200;
        response.write('<html><body>');
        response.write(results);
        response.write('</body></html>');
        response.close();
        page.render('/test.png');
        }
    };
    page.open(url);
};

service = server.listen(8060, function (request, response) {
    if (/^\/getpage/.test(request.url)) {
        getPage(response);
    }
    else {
        response.statusCode = 200;
        response.write('<html><body>');
        response.write(request.url);
        response.write('</body></html>');
        response.close();
    }
});
