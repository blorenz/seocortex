// Includes
var fs = require('fs');
var mfile = require('spooky/io/file');
var mstep = require('spooky/sync/step');
var mrequest = require('joker/dbc/request');
var mresponse = require('joker/dbc/response');

// Constructor
function DBCSolver() {
    // Empty for now :()
} 


// Send request and parse response
DBCSolver.prototype.solveFile = function(filename, callback) {
    this.filename = filename;

    // Flow
    mstep.Step(
        // Send request
        function() {
            var request = new mrequest.DBCRequest(filename);
            var result_page;
            request.send(function(result) {
                result_page = result;
            });
            return result_page;
        },
        // Parse response
        function(result_page) {
            var captcha = null;
            var response = new mresponse.DCBResponse(result_page);
            response.getResult(function(response_text) {
                captcha = response_text;
            });
            return captcha;
        },
        // Return captcha
        function(captcha) {
            callback(captcha);
        }
    );

}


// Write data to file and solve as file
DBCSolver.prototype.solveData = function(image_data, callback) {
    var _this = this;
    var filename = mfile.randomTempFile();

    // Flow
    mstep.Step(
        // Write file
        function() {
            fs.write(filename, image_data, 'w');
        },
        // Solve for data
        function() {
            _this.solveFile(filename, callback);
            console.log("Started solving file");
        }
    );
}




// Exports
exports.DBCSolver = DBCSolver