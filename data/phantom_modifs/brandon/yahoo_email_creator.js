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
// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
    //console.log(msg);
};

// Print usage message, if no address is passed
if (system.args.length < 2) {
    console.log("Usage: yahoo_email_creator.js [path to write images]");
    phantom.exit(1);
} else {
    //address = Array.prototype.slice.call(system.args, 1).join(' ');
    pathToTemp = system.args[1];
    randomInteger = Math.floor( Math.random() * 1000000000);
}

var mnames = require('joker/names/names');

//var theUrl = 'https://login.yahoo.com/config/login_verify2?&.src=ym';
//var theUrl = 'https://edit.yahoo.com/registration?.src=fpctx&.intl=us&.done=http%3A%2F%2Fwww.yahoo.com%2F';
var theUrl = 'http://www.yahoo.com';

var pass = mnames.random_last() + randomInt(32232);
var userAccount = {
                    firstname: mnames.random_female(),
                    secondname: mnames.random_last(),
                    birthday: randomInt(30)+1,
                    birthyear: randomInt(27)+1965,
                   
                    secquestionanswer2: 'turtles',
                    secquestionanswer: 'new york',

                    yahooid: mnames.random_female() + mnames.random_last() + randomInt(32422),

                    password: pass,
                    postalcode: '90210' //randomInt(60000) + 10000
};

//console.log('PASSWORD IS ' + userAccount.password);

var screenshot = function(page,file) {
  page.render('/var/www/html/fewdalism.com/phantomjs/'+file+'.png');
};

var done = false;
// Fills out the signup page
var fillOutPage = function(page,user) {
   var theUri = page.evaluate(function () {
       return document.baseURI; 
   });
   var baseuriprof = null; 
   if (!done) {
        
        require('fs').write('/var/www/html/fewdalism.com/phantomjs/test-before.html',page.content,'w'); 
        done = true;
   }
    var response = page.evaluate(function(user) {
        $('#firstname').val(user.firstname);
        $('#secondname').val(user.secondname);
        $('#gender option[value="m"]').attr("selected", "selected");
        $('#birthdategroup option[value="4"]').attr("selected", "selected");
        $('#dd').val(user.birthday);
        $('#yyyy').val(user.birthyear);
        $('#country option[value="us"]').attr("selected", "selected");
        $('#language option[value="en-US"]').attr("selected", "selected");
        $('#postalcode').val(user.postalcode);
        $('#yahooid').val(user.yahooid);
        $('#password').val(user.password);
        $('#passwordconfirm').val(user.password);
        $('#secquestion option[value="Where did you meet your spouse?"]').attr("selected", "selected");
        $('#secquestionanswer').val(user.secquestionanswer);
        $('#secquestion2 option[value="Where did you spend your childhood summers?"]').attr("selected", "selected");
        $('#secquestionanswer2').val(user.secquestionanswer2);
        $('#language option[value="en-US"]').attr("selected", "selected");
       // #captchaV5ClassicCaptchaImg
       // #captchaV5Answer
       //$('#regFormBody').submit(); 
       $('#IAgreeBtn').click();
        //window.scrollTo($('#IAgreeBtn').offset().left,$('#IAgreeBtn').offset().top);
      // return [$('#IAgreeBtn').offset().left,$('#IAgreeBtn').offset().top];
    },
       JSON.stringify(userAccount) );
  
    page.render('/var/www/html/fewdalism.com/phantomjs/screen_profile.png');
        page.onLoadFinished = null;
    waitFor( function() {
        //console.log('The current uri: ' +theUri);
        screenshot(page,'doesitchange');
        baseuriprof = page.evaluate(function () {
            // Monitoring
           //console.log(document.baseURI);
           return [document.baseURI,document.querySelector('#regConfirmBody') ? 1 : 0]; 
           });
        return (baseuriprof[0] != theUri) || baseuriprof[1];}, delayTheLast, 10000);
};

var nextThing = function() {
        //console.log('URI CHANGED to '+baseuriprof+'!!!!!!!!!!!!');
        require('fs').write('/var/www/html/fewdalism.com/phantomjs/test.html',page.content,'w'); 
        screenshot(page,'urichanged');
        page.injectJs('../common/jquery.js');
        var errormsg = page.evaluate(function () {
            return $('#captchaFldMsg').text();
        });
       
        if (errormsg)
            yahooSignUpPageLoaded();
        else{
            console.log(JSON.stringify(userAccount));
            phantom.exit();}
    }

var dbcQuery = null;
var dbcPoll = null;
var dbcPage = null;
var baseuril = null;
var href = null;


// This is when the first Yahoo! page is loaded
var yahooHomePageLoaded = function() {
                var hpBaseURI = page.evaluate(function() {
                    return document.baseURI;
                });

                //console.log(hpBaseURI);

                href = page.evaluate(function() {
                    //console.log($('span.y-txt-2 a.y-link-1').text());
                    return $('span.y-txt-2 a.y-link-1').attr('href');
                });

                href = "https://edit.yahoo.com/registration?.src=fpctx&.intl=us&.done=http%3A%2F%2Fwww.yahoo.com%2F";
                //console.log(href);
                /*waitFor(function() {
                            // Check in the page if a specific element is now visible
                            page.injectJs('../common/jquery.js');
                            var res = page.evaluate(function(param) {
                                    console.log(document.baseURI);
                                    return $('#firstname').length > 0; 
                            });
                            return res;
                        }, yahooSignUpPageLoaded, 10000);        */

                page.onLoadFinished = function (status) {
                    // Check for page load success
                    screenshot(page,'firsttime');
                    if (status !== "success") {
                        console.log("Unable to access network to signup");
                        phantom.exit(1);
                    } else {
                        page.injectJs('../common/jquery.js');
                        waitFor(function() {
                            // Check in the page if a specific element is now visible
                            var res = page.evaluate(function(param) {
                                    return $('#firstname').length > 0; 
                            });
                            return res;
                        }, delayThePage, 10000);        


                    }
                };
                page.open(encodeURI(href));

                
};
var yahooLoginPageLoaded = function() {
                href = page.evaluate(function() {
                    return $('#signUpBtn').attr('href');
                });
                //console.log(href);            
                page.onLoadFinished = function (status) {
                    // Check for page load success
                    screenshot(page,'firsttime');
                    if (status !== "success") {
                        console.log("Unable to access network to signup");
                        phantom.exit(1);
                    } else {
                        page.injectJs('../common/jquery.js');
                        waitFor(function() {
                            // Check in the page if a specific element is now visible
                            var res = page.evaluate(function(param) {
                                    return $('#firstname').length > 0; 
                            });
                            return res;
                        }, delayThePage, 10000);        


                    }
                };
                page.open(encodeURI(href));

                
};

var delayTheLast = function() {
    //console.log('Delaying!');
    spinFor(nextThing,3000);
}

var delayThePage = function() {
    //console.log('Delaying!');
    spinFor(yahooSignUpPageLoaded,3000);
}
// This loads after the SignUp page has loaded
// This is where you would enter name, information for new account
// May or may not have Captcha
var yahooSignUpPageLoaded = function() {
                            screenshot(page,'doit');
                            page.injectJs('../common/jquery.js');
                            // Isolate the Captcha from Yahoo for analyzing
                           var captchaPage = require('webpage').create();
                            captchaPage.setProxyAuth(proxy.u+':'+proxy.p);
                            captchaPage.setProxy(proxy.ip+':'+proxy.port);
                            captchaPage.applyProxy();
                            var captchaSrc = null;
                            captchaSrc = page.evaluate(function() {
                                                           return $('#captchaV5ClassicCaptchaImg').attr('src');
                                                       });
                            //console.log('Captcha src: ' + captchaSrc);
                            if (!captchaSrc) {
                                //console.log('No Captcha!!!!');
                                fillOutPage(page,userAccount);
                                return;
                            }
                            captchaPage.onLoadFinished = function (success) {
                                // NECESSARY!!! Render out the Captcha to a file
                                captchaPage.render(pathToTemp + '/captcha-'+randomInteger+'.png');
                                // Create new webpage for Death By Captcha
                                dbcPage = require('webpage').create();
                                baseuri = dbcPage.evaluate(function(){ return document.baseURI; });
                                dbcpage.injectJs('../common/jquery.js');
                                dbcpage.injectJs('../common/dbc_form.js');
                                dbcPage.uploadFile('#dbc_file',pathToTemp + '/captcha-'+randomInteger+'.png');
                                dbcPage.evaluate(function() {
                                    $('#dbc_username').val('coding.solo');
                                    $('#dbc_password').val('colonel1');
                                    $('form').submit();    
                                });

                                waitFor(function () {
                                    // Wait until Death By Captcha changes our baseURI to reflect the post redirect
                                    var dbcRes = dbcPage.evaluate(function(){ return document.baseURI; });
                                    return dbcRes != baseuri;
                                }, dbcAPIResponse,10000);
                           };

                           captchaPage.open(captchaSrc);
                        }

var dbcAPIResponse = function() {
                                    // Ok, Death By Captcha has returned us a query string to poll for results
                                    dbcpage.injectJs('../common/jquery.js');
                                    dbcPoll = dbcPage.evaluate(function() { return document.baseURI; });
                                    dbcQuery = dbcPage.evaluate(function() { return $('pre').text(); });
                                    // DEBUG ONLY
                                    // dbcPage.render('/var/www/html/fewdalism.com/phantomjs/dbc.png');
                                    //console.log("DBC QUERY: " +dbcQuery);
                                    //console.log("DBC POLL: " +dbcPoll);
                                    var captchaTest = require('webpage').create();
                                    var captcha = null;
                                    // Now poll Death By Captcha for the result
                                    waitFor(function() {
                                        captchaTest.onLoadFinished = function() {
                                            captchaTest.injectJs('jquery.js');
                                            dbcQuery = captchaTest.evaluate(function() { return $('pre').text(); });
                                            var re = /text=(.*)\&/;
                                            captcha = re.exec(dbcQuery)[1];
                                        };

                                        captchaTest.open(dbcPoll);
                                            return (captcha ? captcha.length > 0 : false); 

                                        },
                                        function() {
                                            //Have the Captcha
                                            //console.log("Captcha is " + captcha);
                                            //phantom.exit();
                                            page.evaluate(function(param) {
                                                $('#captchaV5Answer').val(param);
                                            }, '"' + captcha + '"');
                                            fillOutPage(page,userAccount);
                                            
                                        },
                                        60000,
                                        3000);


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
//page.setEE('nottrue');
// This is the __main__
page.injectJs('../common/jquery.js');
page.onLoadFinished = function (status) {
    // Check for page load success
    if (status !== "success") {
        console.log("Unable to access network for first");
        phantom.exit(1);
    } else {
        page.injectJs('../common/jquery.js');
            waitFor(function() {
                // Check in the page if a specific element is now visible
                var res = page.evaluate(function(param) {
                        return $('span.y-txt-2 a.y-link-1').length > 0; 
                });
                return res;
            }, yahooHomePageLoaded, 10000);        
        //phantom.exit();
    }
};
page.open(encodeURI(theUrl));
