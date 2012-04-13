phantom.injectJs('joker/yahoo/base.js');

var YahooEmailChecker = function(mode,user_account) {
    YahooBase.apply(this);

    // YahooEmailChecker specifics
    this.userAccount = user_account ? user_account : new Object();
    this.twitterActivationLink = null;
    this.twitterAccountInfo = null;

    this.mode = mode ? mode : 'activate-twitter';
}

YahooEmailChecker.prototype = new YahooBase();


YahooEmailChecker.prototype.checkPinterest = function(spam) {

    var whatbox = 'mainbox';
    if (!spam)
        this.mailCenterLoaded();
    else {
        this.spamCenterLoaded();
        whatbox = 'spam';
    }

    var hasPinterest = this.page.evaluate(function() {
        var emails = $('.list-view-items div.flex :nth-child(2)');
        for (email = 0; email < emails.length; email++) {
            if (/Pinterest/.test($(emails[email]).text())) {
               return true; 
            }
        }
        return false;
    });
    //this.screenshot('inbox-' + whatbox);
   
    if (!hasPinterest) {
        console.log('No Pinterest found in ' + whatbox);
        return false;
    }
    else {
        console.log('Pinterest was found in ' + whatbox + '!!!');
        return true;
    }

   return true; 
}

YahooEmailChecker.prototype.clickPinterestEmail = function () {
    var twitterEmail = null;

    var el = this.page.evaluate(function() {
        var emails = $('.list-view-items div.flex :nth-child(2)');
        var twitterEmail = null;
        for (email = 0; email < emails.length; email++) {
            if (/Pinterest/.test($(emails[email]).text())) {
                twitterEmail = emails[email];
            }
        }
        return [$(twitterEmail).offset().left,$(twitterEmail).offset().top];
    });
    this.page.sendEvent('click',el[0],el[1]);
};

YahooEmailChecker.prototype.doTwitterActivation = function() {
     
    // Initiliaze it
    console.log('doTwitterActivation');
    this.mailCenterLoaded();

    var hasTwitterActivation = this.page.evaluate(function() {
        var emails = $('.list-view-items div.flex :nth-child(2)');
        var twitterEmail = null;
        for (email = 0; email < emails.length; email++) {
            if (/Confirm your Twitter account/.test($(emails[email]).text())) {
               return true; 
            }
        }
        return false;
    });
   
    if (!hasTwitterActivation) {
        console.log('No Twitter found');
        return false;
    }

    var el = this.page.evaluate(function() {
        var emails = $('.list-view-items div.flex :nth-child(2)');
        var twitterEmail = null;
        for (email = 0; email < emails.length; email++) {
            if (/Confirm your Twitter account/.test($(emails[email]).text())) {
                twitterEmail = emails[email];
            }
        }
        return [$(twitterEmail).offset().left,$(twitterEmail).offset().top];
    });
    this.page.sendEvent('click',el[0],el[1]);
    return true;
}

YahooEmailChecker.prototype.activatePinterest = function() {
    console.log('Activation!!!!');
    this.twitterActivationLink = this.page.evaluate(function() {
        return $('div.message.content iframe:visible').contents().find('html a:last').attr('href');
    });
    console.log(this.twitterActivationLink);
    // Goes to pinterest page
    // $('#SignUp p a:first')  for twitter
    // On twitter page:
    // $('#username_or_email')  and $('#password')  then $('#allow') is button x2
    // $('#id_username') $('#id_email') $('#id_password') $('#CompleteSignupButton')
    // Get some pins
    // $('a.pin') $('a#welcome_follow_people')
    //
    // $('#to_board_create_button')
    // 
    // Boards -----
    // $('#Boards li.entry')   'a.RemoveBoard')
    // $('#BoardSuggestions li a')
    // $('#Boards li input:last').val('This is awesome 2')
    // $('#AddButton').click()
    // $('#board_create_button').removeClass('disabled')
    // $('#board_create_button').click()
};

YahooEmailChecker.prototype.activateTwitter = function() {
    this.twitterActivationLink = this.page.evaluate(function() {
        return $('div.message.content iframe:visible').contents().find('html p a').html();
    });
    console.log(this.twitterActivationLink);

    //Open Twitter and log in
    //and activate
};

YahooEmailChecker.prototype.setTwitterAccount= function(account) {
    this.twitterAccountInfo = account;
}

YahooEmailChecker.prototype.logInToTwitter = function() {
    this.injectJquery();
    var json = JSON.stringify(this.twitterAccountInfo);
    console.log(json);
    var theReturn = this.page.evaluate(function (theUser) {
        $('input.js-username-field').val(theUser.username);
        $('input.js-password-field').val(theUser.password);
        var offsets = $('.submit:nth-child(3)').offset();
        //return document.baseURI; 
        return [offsets.left,offsets.top];
    },json);

    /*var ret = this.page.evaluate(function (user) {
        $('input.js-username-field').val(user.username);
        $('input.js-password-field').val(user.password);
        var offsets = $('.submit:first').offset();
        return document.baseURI; 
    //    return [offsets.left(),offsets.top()];
        }, this.twitterAccountInfo);*/

    console.log('after evaluate');
    var selector = "#page-container .submit";
    this.page.sendEvent('click',theReturn[0],theReturn[1]);
}

YahooEmailChecker.prototype.mailCenterLoaded = function() {
    console.log('mailcenter');
    this.injectJquery();

    // Click on Inbox
   var selector = "#tabinbox b";
   mutils.clickOnPage(this.page,selector);
};

YahooEmailChecker.prototype.spamCenterLoaded = function() {
    this.injectJquery();

    var selector = "#system-folders .spam";
    mutils.clickOnPage(this.page,selector);
}

YahooEmailChecker.prototype.run = function(callback) {
    // Pass useraccount
    //this.user_account = account ? account : this.user_account;

    var par = this;
    // Go to homepage
    var loadLogin = function() {
        console.log("Loading homepage")
        console.log(JSON.stringify(par.user_account));
        par.loadLogin(yahooLoginPageLoaded);
    }

    var yahooLoginPageLoaded = function() {
                par.injectJquery();
                var loginuri = mutils.getURI(par.page); 

                var href = par.page.evaluate(function(user) {
                        $('#username').val(user.username); 
                        $('#passwd').val(user.password); 
                        $('#submit button').click();
                }, JSON.stringify(par.userAccount));
                
                mutils.waitForWithParam(function(newpar) {
                    // Check in the page if a specific element is now visible
                    var pageuri = mutils.getURI(newpar.page);
                    //console.log(loginuri);
                    //console.log(pageuri);
                    return loginuri != pageuri;
                }, par, delayThePage, 10000);        
        
    };

    var delayThePage = function() {
        console.log('Delaying the Page!');
        par.page.onLoadFinished = null;
       
        var modeFunc = null;

        switch (par.mode) {

            case 'activate-twitter': modeFunc = doTwitterActivation;
                                     break;
            
            case 'check-pinterest': modeFunc = checkPinterest;
                                     break;
            
            default: modeFunc = doTwitterActivation;
                     break;
        }

        mutils.spinFor(modeFunc,3000);


        //mutils.spinFor(doTwitterActivation,3000);
    }

    var checkPinterest = function() {
        if (par.checkPinterest()) {
            par.clickPinterestEmail();
            mutils.spinFor(activatePinterest, 3000);
        }
        else {
            par.spamCenterLoaded();
            mutils.spinFor(checkPinterestSpam, 3000);
        }
    }

    var checkPinterestSpam = function() {
        if (par.checkPinterest(true)) {
            par.clickPinterestEmail();
            mutils.spinFor(activatePinterest, 3000);
        }

    }

    var activatePinterest = function() {
        console.log('Let us activate');
        par.activatePinterest();
    }

    var doTwitterActivation = function() {
        if (par.doTwitterActivation())
            mutils.spinFor(activateTwitter,3000);
    }

    var activateTwitter = function() {
        par.activateTwitter();

        par.page.open(par.twitterActivationLink, logInToTwitter);
    }

    var logInToTwitter = function() {
        par.page.onLoadFinished = null;
        console.log('Time to open'); 
        console.log(par.twitterAccountInfo.username);
        mutils.spinFor(loginLoadedForTwitter, 5000);
    }

    var loginLoadedForTwitter = function() {
        par.logInToTwitter();
    }

    

    var finalize = function() {
        // Sucess
       var url = 'http://ifnseo.com:8088/yahoo/add?jsondata=' + encodeURIComponent(JSON.stringify(par.user_account)); 
           console.log(url);
        require('webpage').create().open(url, theEnd);
    }

    var theEnd = function(success) {
        if (success)
            console.log('Success');
        else
            console.log('Failure');

    }
    
    var doCallback = function() {
        var value = par.failed ? null : par.user_account;
        callback(value);
        return null;
    }


    loadLogin();
}

var exports = exports || {};
// Exports
exports.YahooEmailChecker = YahooEmailChecker;



