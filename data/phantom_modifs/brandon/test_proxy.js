
function Fetcher(url, proxy, proxy_auth) {
    this.proxy = proxy;
    this.proxy_auth = proxy_auth;
    this.proxy_type = 'http';
    this.url= url;
}

Fetcher.prototype.build_page = function () {
    this.page = new WebPage();
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

Fetcher.prototype.fetch = function() {
    var _this = this;
    this.build_page();
    this.page.open(this.url, function(status) {
        _this.on_fetch.call(_this, status);
    });
}

Fetcher.prototype.on_fetch = function(status) {


    var ip = this.page.evaluate(function () {
        try {
            return document.querySelectorAll('#ip')[0].innerText;
        }
        catch(error) {
            return "no_ip_found : "+error+" status = "+status;
        }
    })
    console.log("IP = "+ip);
    //console.log(this.page.content)
}



var proxies = [
                    {'ip':'50.117.24.226', 'port':'3131', 'u' : '31a89a8cbaae43b6', 'p' : '56024ab39ee54dcf'},
                    {'ip':'50.117.68.212', 'port':'3131', 'u' : 'cbf69c8854ba4d04', 'p' : 'b7bb6255996749dd'},
                    {'ip':'50.117.69.0', 'port':'3131', 'u' : 'fb8c9c5ee75e4f57', 'p' : '4add5380d904463c'},
                    {'ip':'50.117.69.212', 'port':'3131', 'u' : '4edb9bc1c2fa4cf2', 'p' : '192384efd5e24fa4'},
                    {'ip':'50.117.70.1', 'port':'3131', 'u' : '9404854294b04337', 'p' : '784c84deb85c44f8'},
                    {'ip':'50.117.70.212', 'port':'3131', 'u' : '4d4fff780c02423d', 'p' : 'd918ca12a0ed4a7b'},
                    {'ip':'50.117.71.1', 'port':'3131', 'u' : '0baf28faba404420', 'p' : '189b850e3fe24d09'},
                    {'ip':'50.117.71.213', 'port':'3131', 'u' : '791b457dd2414762', 'p' : '7ed5670febb34e0d'},
                    {'ip':'173.208.130.10', 'port':'3131', 'u' : 'd947f173e03449aa', 'p' : '22853a3d90154a90'},
                    {'ip':'173.208.130.249', 'port':'3131', 'u' : 'b5ad668b72a84b93', 'p' : '8601db9523f84456'},
                    {'ip':'173.208.145.164', 'port':'3131', 'u' : 'abd0ed0ca4d24913', 'p' : 'a9431c8f37ba4509'},
                    {'ip':'173.208.145.82', 'port':'3131', 'u' : '53b9e92da15247e5', 'p' : 'f7250e69cfa845ef'},
                    {'ip':'173.208.153.235', 'port':'3131', 'u' : 'c0fbf735c6fe4ca9', 'p' : 'f2aa81122bda4f6a'},
                    {'ip':'173.208.158.167', 'port':'3131', 'u' : '82513de71c1248f3', 'p' : 'b01bfe42a4ff492c'},
                    {'ip':'50.117.64.10', 'port':'3131', 'u' : 'e1a213b3c10d47c8', 'p' : '67da9da435384bc0'},
                    {'ip':'50.117.64.24', 'port':'3131', 'u' : '1124e174b2274f35', 'p' : '4a4e1bd0c87444eb'},
                    {'ip':'50.117.65.15', 'port':'3131', 'u' : '2882da2640de4f0a', 'p' : '07e47cdbd8714484'},
                    {'ip':'50.117.65.74', 'port':'3131', 'u' : '37b82961ace9499a', 'p' : 'af015f7d99ae4ded'},
                    {'ip':'50.117.66.233', 'port':'3131', 'u' : 'd7b536dbb5844906', 'p' : 'c302b1cf423a49d8'},
                    {'ip':'50.117.67.167', 'port':'3131', 'u' : 'f0fab0d16a274379', 'p' : '9f4f024b325f4201'},
            ];
                
// Testing
for(proxy_id in proxies) {
    var proxy = proxies[proxy_id];
    url = 'http://www.whatismyip.com';
    var f = new Fetcher(url, proxy.ip+":"+proxy.port, proxy.u+":"+proxy.p);
    f.fetch();
}

