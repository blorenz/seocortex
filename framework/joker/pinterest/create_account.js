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
       par.screenshot('step1');
       mutils.clickOnPage(par.page, '#SignUp p a:first');
       par.setCurrentURI();
       par.waitForPageToChange(twitterLoaded);
    }

    var twitterLoaded = function twitterLoaded() {
        par.injectJquery();
        var map = {
        '#username_or_email': par.account.twitter.username,
        '#password': par.account.twitter.password,
        };
        mutils.populateTextInputs(par.page,map);
        par.screenshot('step2');
        mutils.clickOnPage(par.page,'#allow');
       par.waitForPageToChange(pinterestEnterAccountInfo);
    }


    var pinterestEnterAccountInfo = function pinterestEnterAccountInfo() {
        par.injectJquery();
        var map = {
            '#id_username': par.account.pinterest.username,
            '#id_email': par.account.pinterest.email,
            '#id_password': par.account.pinterest.password,
        };
        mutils.populateTextInputs(par.page,map);
        par.page.evaluate(function() { $('#CompleteSignupButton').removeClass('disabled'); });
       par.screenshot('step3');
        mutils.clickOnPage(par.page, '#CompleteSignupButton');
    }

    var pinterestSelectPins = function pinterestSelectPin() {
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

