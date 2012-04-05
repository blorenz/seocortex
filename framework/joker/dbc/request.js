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
        function setupPage() {
            page.injectJs('web_js/joker/jquery.js');
            page.injectJs('web_js/joker/dbc_form.js');
            page.uploadFile('#dbc_file', _this.filename);        
            return null;
        },
        // Start file upload
        function startUpload() {
            var mdata = {
                username : username,
                password : password,
            };
            // Wait till page load to trigger next flow state
            var that = this;
            var f = function(status) { that(status); };
            page.onLoadFinished = f;
            page.evaluate(function(data) {
                $('#dbc_username').val(data.username);
                $('#dbc_password').val(data.password);
                $('form').submit();
            },
                JSON.stringify(mdata)
            );
        },
        function doCallback(status) {
            callback(page);
            return null;
        }
    );
}


// Exports
exports.DBCRequest = DBCRequest