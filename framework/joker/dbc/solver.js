// Includes
var fs = require('fs');
var mfile = require('spooky/io/file');
var mrequest = require('joker/dbc/request');
var mresponse = require('joker/dbc/response');

// Constructor
function DBCSolver() {
    // Empty for now :()
} 


// Send request and parse response
DBCSolver.prototype.solveFile = function(filename) {
    this.filename = filename;
    var request = new mrequest.DCBRequest(filename);
    var result_page = request.send();

    var response = new mresponse.DCBResponse(result_page);
    return response.getResult();
}


// Write data to file and solve as file
DBCSolver.prototype.solveData = function(image_data) {
    var filename = mfile.randomTempFile();
    fs.write(filename, image_data, 'w');
    return this.solveFile(filename);
}




// Exports
exports.DBCSolver = DBCSolver