phantom.injectJs('joker/bhw/base.js');


var BHWThread = function(url) {
    BHWBase.apply(this);

    this.postsOnPage = null;
    this.baseURL = url;
};

BHWThread.prototype = new BHWBase();


BHWThread.prototype.setNumberOfPages = function setNumberOfPages() {

    this.injectJquery();
    var ret = this.page.evaluate(function() {
        var r = new RegExp("([0-9]+) of ([0-9]+)"); 
        var p = r.exec($('#postpagestats_above').text().trim());
        return p;
    });

    this.totalPages = Math.ceil(ret[2] / ret[1]);
    this.currentPage = 1;

};

BHWThread.prototype.setBaseThreadURL = function setBaseThreadURL() {
    var p = this.page.evaluate(function() { return document.location.href; } );
    var r = new RegExp("(.*\).html");
    this.baseThreadURL = r.exec(p)[1];
}

BHWThread.prototype.nextPage = function nextPage(callback) {
    if (this.currentPage + 1 <= this.totalPages) {
        this.currentPage++;
        this.page.onLoadFinished = callback;
        this.page.open(this.baseThreadURL + '-' + this.currentPage + '.html');
    }
};

BHWThread.prototype.setPostsOnPage = function setPostsOnPage() {

    this.injectJquery();
    this.postsOnPage = this.page.evaluate(function() {
        var arr = [];
        $('.postcontainer').each(function() {
           arr.push($(this).html()); 
        });
       return arr; 
    });
};

BHWThread.prototype.getPostUsername = function getPostUsername(param) {

};

BHWThread.prototype.pageLoaded = function pageLoaded() {
        console.log(this);
        this.page.onLoadFinished = null;
        this.setPostsOnPage();
        for (var post in this.postsOnPage) {
        //    console.log($('body').html(this.postsOnPage[post]).find('.username').text());
         //   console.log($('.postcontent').text());
        }

        this.nextPage(this.pageLoaded);
};

BHWThread.prototype.run = function run() {
   var par = this;

   var threadLoaded = function threadLoaded() {
        par.page.onLoadFinished = null;
        par.setNumberOfPages();
        par.pageLoaded();
   };


 
   console.log(par.baseURL);
   par.page.open(par.baseURL, threadLoaded);


};

var exports = exports || {};
// Exports
exports.BHWThread = BHWThread;
