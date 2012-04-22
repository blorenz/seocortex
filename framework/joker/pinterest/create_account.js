phantom.injectJs('joker/pinterest/base.js');

var PinterestAccountCreator = function(link, user_account) {
    console.log('DOING IT!'); 
    PinterestBase.apply(this);

    // YahooEmailChecker specifics
    this.account = user_account ? user_account : new Object();
    this.inviteLink = link;
}
PinterestAccountCreator.prototype = new PinterestBase();


PinterestAccountCreator.prototype.run = function() {
   
    var par = this;

    var openPinterestInvite = function openPinterestInvite() {
        par.page.open(par.inviteLink, chooseTwitter);
    }

// Should be at the Invite page.  Should assert?
    var chooseTwitter = function chooseTwitter() {
        // $('#SignUp p a:first')  for twitter  HARD CLICK
        par.page.onLoadFinished = null;
        par.injectJquery();
       par.screenshot('step1');
       par.setCurrentURI();
       mutils.clickOnPage(par.page, '#SignUp p a:first');
       console.log('This page: ' + par.currentURI);
       mutils.spinFor(twitterLoaded,5000);
    }

    var twitterLoaded = function twitterLoaded() {
        par.injectJquery();
        var map = {
        '#username_or_email': par.account.twitter.username,
        '#password': par.account.twitter.password,
        };
       mutils.populateTextInputs(par.page,map);
       par.setCurrentURI();
        par.screenshot('step2');
       console.log('This page 2: ' + par.currentURI);
        mutils.clickOnPage(par.page,'#allow');
       mutils.spinFor(pinterestEnterAccountInfo,15000);
       //par.waitForPageToChange(pinterestEnterAccountInfo);
    }


    var pinterestEnterAccountInfo = function pinterestEnterAccountInfo() {
       par.screenshot('step3');
        par.injectJquery();
        par.page.evaluate(function() { $('#CompleteSignupButton').removeClass('disabled'); });
       mutils.spinFor(pinterestEnterAccountInfo2,5000);
    }
    
    var pinterestEnterAccountInfo2 = function pinterestEnterAccountInfo2() {
        var map = {
            '#id_username': par.account.pinterest.username,
            '#id_email': par.account.pinterest.email,
    //        '#id_password': par.account.pinterest.password,
        };
        mutils.typeOnPage(par.page, par.account.pinterest.password, '#id_password');
       par.setCurrentURI();
       par.screenshot('step234234');
       phantom.exit();
       console.log(JSON.stringify(map));
        mutils.populateTextInputs(par.page,map);
       console.log(par.currentURI);
       par.screenshot('step3.5');
      mutils.clickOnPage(par.page, '#CompleteSignupButton');
       mutils.spinFor(pinterestSelectPins,15000);
    }

    var pinterestSelectPins = function pinterestSelectPins() {
       par.setCurrentURI();
       console.log(par.currentURI);
        par.injectJquery();
        par.page.evaluate(function() {
            var nPins = $('a.pin').length;
            var total = Math.random() * nPins + 1;
            
            for (var i = 0; i < total; i++) {
                $('a.pin')[Math.random() * nPins].click();
            }
            $('a#welcome_follow_people').click();
        });
       par.screenshot('step4');
       //mutils.spinFor(pinterestSelectPins,5000);
    }
    // $('#to_board_create_button')
    // 
    // Boards -----
    // $('#Boards li.entry')   'a.RemoveBoard')
    // $('#BoardSuggestions li a')
    // $('#Boards li input:last').val('This is awesome 2')
    // $('#AddButton').click()
    // $('#board_create_button').removeClass('disabled')
    // $('#board_create_button').click()
    //
    // $('a.BigButton.BlueButton') HARD CLICK
    openPinterestInvite();
}


var exports = exports || {};
// Exports
exports.PinterestAccountCreator = PinterestAccountCreator;

