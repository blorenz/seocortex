// Includes
var mviews = require('spooky/views/base');
var msolver = require('joker/dbc/solver');


// Constructor
function SolveURL() {
    mviews.BaseView.call(this);
    this.content_type = 'application/json';
}
SolveURL.prototype = new mviews.BaseView();
SolveURL.prototype.constructor = SolveURL;


// Methods
SolveURL.prototype.get = function(request, response) {
    var solver = new msolver.DBCSolver();
    var url = request.GET['url'];
    console.log("URL = "+url);
    solver.solveURL(url, function(solution) {
        var data = {'solution' : solution, 'status' : solution ? 'ok' : 'failed'};
        response.write(JSON.stringify(data));
        response.close();
    })
}
 

// Constructor
function SolveFilename() {
    mviews.BaseView.call(this);
    this.content_type = 'application/json';
}
SolveFilename.prototype = new mviews.BaseView();
SolveFilename.prototype.constructor = SolveURL;


// Methods
SolveFilename.prototype.get = function(request, response) {
    var solver = new msolver.DBCSolver();
    var filename = request.GET['filename'];
    solver.solveFilename(filename, function(solution) {
        var data = {'solution' : solution, 'status' : solution ? 'ok' : 'failed'};
        response.write(JSON.stringify(data));
        response.close();
    })
}
 

// Exports
exports.SolveURL = SolveURL
exports.SolveFilename = SolveFilename