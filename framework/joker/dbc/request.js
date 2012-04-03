// Includes
var mutils = require('spooky/utils/utils');
var mstep = require('spooky/sync/step');


// Consts
var DBC_USERNAME = 'coding.solo';
var DBC_PASSWORD = 'colonel1';


// Constructor
function DBCRequest(filename, username, password) {
    // path of the file to upload
    this.filename = filename;
    this.username = username ? username : DBC_USERNAME;
    this.password = password ? password : DBC_PASSWORD;
} 


// Methods
DBCRequest.prototype.send = function(callback) {
    var _this = this;
    var page = new WebPage();
    var username = this.username;
    var password = this.password;
    var startURL = page.evaluate(function(){ return document.baseURI; });


    // Flow
    mstep.Step(
        // Setup page
        function() {
            console.log("Setting up form");
            try {
                page.injectJs('../common/jquery.js');
                page.injectJs('../common/dbc_form.js');
                page.uploadFile('#dbc_file', _this.filename);            
            } catch(error) {
                console.log("DBCRequest Error - Setting up form :"+error);
                phantom.exit();
            }
            return page;
        },
        // Start file upload
        function(_page) {
            var mdata = {
                username : _this.username,
                password : _this.password
            };
            console.log("Submitting form");
            try {            
                page.evaluate(function(data) {
                    $('#dbc_username').val(data.username);
                    $('#dbc_password').val(data.password);
                    $('form').submit();    
                },
                    JSON.stringify(mdata)
                );      
            } catch(error) {
                console.log("DBCRequest Error - Submitting Form : "+error);
                phantom.exit();
            }
        },
        // Wait till upload is submitted
        function() {
            console.log("Polling");
            try {
                mutils.waitFor(function () {
                    // Check if URL has changed
                    var newURL = page.evaluate(function(){ return document.baseURI; });
                    return newURL != startURL;
                }, function() {},10000);
                return page;
            } catch(error) {
                console.log("DBCRequest Error - Polling : "+error);
                phantom.exit();
            }
        },
        // Run callback
        function(current_page) {
            callback(current_page);
        }
    );
}


// Exports
exports.DBCRequest = DBCRequest