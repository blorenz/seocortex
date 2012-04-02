// Includes
var mutils = requrie('spooky/utils/utils');

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
DBCRequest.prototype.send = function() {
    var page = new WebPage();
    var username = this.username;
    var password = this.password;
    var startURL = dbcPage.evaluate(function(){ return document.baseURI; });

    // Setup page
    page.injectJs('jquery.js');
    page.injectJs('dbc_form.js');
    page.uploadFile('#dbc_file', this.filename);

    // Start file upload
    page.evaluate(function() {
        $('#dbc_username').val(username);
        $('#dbc_password').val(password);
        $('form').submit();    
    });

    // Wait till submitted
    mutils.waitFor(function () {
        // Check if URL has changed
        var newURL = page.evaluate(function(){ return document.baseURI; });
        return newURL != startURL;
    }, function() {},10000);

    // Once finished return page
    return page;
}


// Exports
exports.DBCRequest = DBCRequest