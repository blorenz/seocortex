var server, service;

server = require('webserver').create();



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
