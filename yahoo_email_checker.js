
function waitFor(testFx, onReady, timeOutMillis, hammerTime) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
        maxHammerTime = hammerTime ? hammerTime : 250,
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    //console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    //console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, maxHammerTime); //< repeat check every 250ms
};

function spinFor(onReady, timeOutMillis, hammerTime) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
        maxHammerTime = hammerTime ? hammerTime : 250,
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    //console.log("'waitFor()' timeout");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    //console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, maxHammerTime); //< repeat check every 250ms
};
// Return an int
var randomInt = function(maxInt) {
    return Math.floor(Math.random() * maxInt);
}

var page = require('webpage').create(),
    system = require('system');

page.viewportSize = { width: 1080, height: 1000 };
page.settings.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.20 (KHTML, like Gecko) Chrome/19.0.1036.7 Safari/535.20";
page.settings.userAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11";
// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
    console.log(msg);
};


var checkMode = function(mode) {

    switch (mode) {

        case 'fun':
            break;

        default:
            console.log('Not a valid mode');
        //    phantom.exit();
            break;
    }
};

// Print usage message, if no address is passed
if (system.args.length < 4) {
    console.log("Usage: yahoo_email_creator.js [mode] [username] [password]");
    phantom.exit(1);
} else {
    //address = Array.prototype.slice.call(system.args, 1).join(' ');
    mode = system.args[1];
    username = system.args[2];
    password = system.args[3];
    checkMode(mode);
    randomInteger = Math.floor( Math.random() * 1000000000);
}

var mnames = require('joker/names/names');

//var theUrl = 'https://login.yahoo.com/config/login_verify2?&.src=ym';
//var theUrl = 'https://edit.yahoo.com/registration?.src=fpctx&.intl=us&.done=http%3A%2F%2Fwww.yahoo.com%2F';
var theUrl = 'https://login.yahoo.com/config/login_verify2?.intl=us&.src=ym';

var pass = mnames.random_last() + randomInt(32232);
var userAccount = {
    username: username,
    password: password
};


//console.log('PASSWORD IS ' + userAccount.password);

var screenshot = function(page,file) {
    return;
  page.render('/var/www/html/fewdalism.com/phantomjs/'+file+'.png');
};

var done = false;


var dbcQuery = null;
var dbcPoll = null;
var dbcPage = null;
var baseuril = null;
var href = null;


var yahooLoginPageLoaded = function() {
                console.log('yahooLoginPageLoaded');
                page.injectJs('jquery.js');
                var loginuri = page.evaluate(function(){ return document.baseURI; });
                var href = page.evaluate(function(user) {
                        $('#username').val(user.username); 
                        $('#passwd').val(user.password); 
                        $('#submit button').click();
                }, JSON.stringify(userAccount));
                screenshot(page,'somethingorother');
                
                waitFor(function() {
                    // Check in the page if a specific element is now visible
                    var pageuri = page.evaluate(function(){ return document.baseURI; });
                    //console.log(loginuri);
                    //console.log(pageuri);
                    screenshot(page,'thisiswhatitis');
                    return loginuri != pageuri;
                }, delayThePage, 10000);        
        
};

var clickOnPage = function(page,selector) {
   var el = page.evaluate(function(sel) {
               var offset = $(sel).offset(); 
               return [offset.left,offset.top];
   }, JSON.stringify(selector));
   page.sendEvent('click',el[0],el[1]);
};

var clickOnPageNoJSON = function(page,selector) {
   var el = page.evaluate(function(sel) {
               var offset = $(sel).offset(); 
               return [offset.left,offset.top];
   }, selector);
   page.sendEvent('click',el[0],el[1]);
};

var screenEnd = function() {
    screenshot(page,'hereiam-dude-2');
    page.settings.WebSecurityEnabled = false;
    var ret = page.evaluate(function() {
        console.log($('div.message content iframe:visible'));
        console.log($('div.message content iframe:visible').contents());
        console.log($('div.message content iframe:visible').contents().find('html').html());
        return $('div.message.content iframe:visible').contents().find('html p a').html();
    });
    console.log(ret);
    phantom.exit();
};

var yahooSomethingLoaded = function() {
   page.injectJs('jquery.js');
    var loginuri = page.evaluate(function(){ return document.baseURI; });
   console.log(loginuri);
   //page.sendEvent('click',130,100);
   var selector = "#tabinbox b";
   clickOnPage(page,selector);
    screenshot(page,'hereiam-dude');
    /// ended
    phantom.exit();
    var el = page.evaluate(function() {
        var emails = $('.list-view-items div.flex :nth-child(2)');
        var twitterEmail = null;
        for (email = 0; email < emails.length; email++) {
            if (/Confirm your Twitter account/.test($(emails[email]).text())) {
                twitterEmail = emails[email];
            }
        }
        return [$(twitterEmail).offset().left,$(twitterEmail).offset().top];
    });
    page.sendEvent('click',el[0],el[1]);
    spinFor(screenEnd,3000);
   // $('#Inbox').click()
   // $('.list-view-items div.flex').click()
   /*var inbox = page.evaluate(function() { return [$('#inbox a').attr('href'), document.domain]; });
    screenshot(page,'urichanged');

        page.onLoadFinished = function (status) {
            // Check for page load success
        if (status !== "success") {
            console.log("Unable to access network for first");
            phantom.exit(1);
        } else {
            page.injectJs('jquery.js');
            require('fs').write('/var/www/html/fewdalism.com/phantomjs/test.html',page.content,'w'); 
            screenshot(page,'hereiam');

            var emails = page.evaluate(function() { 
                    var ret = [];
                    $('#datatable tr h2').each( function() { 
                        ret.push([$(this).text(),$('a',this).attr('href')]);
                    });
                    return ret;

                });

            for (i = 0; i < emails.length; i++) {
                console.log(emails[i][0] +": " + emails[i][1]);
            }
            
            phantom.exit();
        }
    };
        var inboxURL = "http://" + inbox[1] + "/mc/" + inbox[0];
        console.log(inboxURL);
        page.open(encodeURI(inboxURL));*/


};

var finalStep = function() {
    screenshot(page,'intherest');
    phantom.exit();
};


var delayThePage = function() {
    console.log('Delaying the Page!');
    page.onLoadFinished = null;
    spinFor(yahooSomethingLoaded,3000);
}

// Proxies
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
proxy = proxies[randomInt(proxies.length)];
page.setProxyAuth(proxy.u+':'+proxy.p);
page.setProxy(proxy.ip+':'+proxy.port);
page.applyProxy();

page.settings.WebSecurityEnabled = false;
page.setEE('true');
// This is the __main__
page.injectJs('jquery.js');
page.onLoadFinished = function (status) {
    // Check for page load success
    if (status !== "success") {
        console.log("Unable to access network for first");
        phantom.exit(1);
    } else {
        page.injectJs('jquery.js');
            waitFor(function() {
                // Check in the page if a specific element is now visible
                var res = page.evaluate(function(param) {
                        return $('#passwd').length > 0; 
                });
                return res;
            }, yahooLoginPageLoaded, 10000);        
        //phantom.exit();
    }
};
page.open(encodeURI(theUrl));
