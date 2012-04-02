// Includes
var mutils = require('spooky/utils/utils');

// Constructor
function Fetcher(url, proxy, proxy_auth, proxy_type, preserve_page) {
    this.proxy = proxy;
    this.proxy_auth = proxy_auth;
    this.proxy_type = proxy_type ? proxy_type : 'http';
    this.url= url;
    // Preserve page through requests
    this.preserve_page = preserve_page ? preserve_page : false;
}

Fetcher.prototype.buildPage = function () {
    this.page = this.page && this.preserve_page ? this.page : new WebPage();
    if(this.proxy)
    {
        this.page.setProxyType(this.proxy_type);
        this.page.setProxy(this.proxy);
        if(this.proxy_auth)
        {
            this.page.setProxyAuth(this.proxy_auth);
        }
        this.page.applyProxy();
    }
}

Fetcher.prototype.fetch = function(url, callback) {
    this.url = url ? url : this.url;
    var _this = this;
    this.buildPage();
    this.page.open(this.url, function(status) {
        if(!callback) {
            _this.onFetch.call(_this, status);
        }
        else {
            callback(status, _this.page);
        }
    });
}

Fetcher.prototype.blockingFetch = function(url) {
    var ready = false;
    var failed = false;

    // Gernerate request
    this.fetch(url, function(status) {
        if(status !== 'success') {
            failed = true;
        }
        ready = true;
    });

    // Block here
    mutils.waitFor(function() {
        return ready;
    },
    function() {

    })
    return failed ? null : this.page;
}


Fetcher.prototype.onFetch = function(status) {
    // Inherit to customize
} 


// Exports
exports.Fetcher = Fetcher