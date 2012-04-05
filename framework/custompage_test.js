// Includes


// Constructor
function MyPage(somedata) {
    this.somedata = somedata;
} 
MyPage.prototype = new WebPage();
MyPage.prototype.constructor = MyPage;


MyPage.prototype.open = function(url, callback) {
    console.log("Before opening");
    WebPage.prototype.open.call(this, url, callback);
    console.log("After opening");
};



// Testing
var page = new MyPage();
page.open('http://peoplze.com', function(status) {
    console.log("status ="+status)
});