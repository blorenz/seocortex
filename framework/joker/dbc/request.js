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
        // Setup page
        var setupPage = function () {
            page.injectJs('web_js/joker/jquery.js');
            page.injectJs('web_js/joker/dbc_form.js');
            page.uploadFile('#dbc_file', _this.filename);        
            startUpload();
        }
        // Start file upload
        var startUpload = function () {
        
            var mdata = {
                username : username,
                password : password,
            };
            // Wait till page load to trigger next flow state
            page.onLoadFinished = null;
            page.evaluate(function(data) {
                $('#dbc_username').val(data.username);
                $('#dbc_password').val(data.password);
                $('form').submit();
            },
                JSON.stringify(mdata)
            );

            // Wait until the submit reflects DBC JSON
            mutils.waitFor(function() {
                var newbase = page.evaluate(function() {
                    return document.baseURI;
                });
                return newbase != startURL;
            }, doCallback, 10000);
        }

        var doCallback = function (status) {
            callback(page);
        }


        setupPage();
        
}


// Exports
exports.DBCRequest = DBCRequest
