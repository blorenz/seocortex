var webserver = require('webserver');
// Testing
webserver.create().listen(8086, function(request, response) {
    response.write("Good");
    response.close();
}); 
