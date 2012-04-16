phantom.injectJs('joker/pinterest/base.js');

var PinterestAccountCreator = function(user_account) {
    YahooBase.apply(this);

    // YahooEmailChecker specifics
    this.account = user_account ? user_account : new Object();
    this.inviteLink = null;
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
       mutils.clickOnPage(par.page, '#SignUp p a:first');
       par.waitForPageToChange(twitterLoaded);
    }

    var twitterLoaded = function twitterLoaded() {
        var map = {
        '#username_or_email': par.account.twittername,
        '#password': par.account.twitterpassword,
        };
        mutils.populateTextInputs(par.page,map);
        mutils.clickOnPage(par.page,'#allow');
    }


    var pinterestEnterAccountInfo = function pinterestEnterAccountInfo() {
        var map = {
            '#id_username': par.account.pinterestusername,
            '#id_email': par.account.pinterestemail,
            '#id_password': par.account.pinterest_password,
        };
        mutils.populateTextInputs(par.page,map);
        par.page.evaluate(function() { $('#CompleteSignupButton').removeClass('disabled'); });
        mutils.clickOnPage(par.page, '#CompleteSignupButton');
    }

    var pinterestSelectPins = function pinterestSelectPin() {
        par.page.evaluate(function() {
            var nPins = $('a.pin').length;
            var total = Math.random() * nPins + 1;
            
            for (var i = 0; i < total; i++) {
                $('a.pin')[Math.random() * nPins].click();
            }
            $('a#welcome_follow_people').click();
        });
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

}



var userAccount = {
                    login: username,
                    password: password,
                    profilename: profilename
};

page.open(encodeURI(theUrl), function (status) {
    // Check for page load success
    if (status !== "success") {
        console.log("Unable to access network");
    } else {
        //
        //
        //
        // Execute some DOM inspection within the page context
        login(page, userAccount.login, userAccount.password, userAccount.profilename);
        waitFor(function() {
            // Check in the page if a specific element is now visible
            var res = page.evaluate(function(param) {
                    return $('li#UserNav a.nav').length > 0; 
            });
            return res;
        }, function() {
           console.log("You are logged in now.");
           phantom.exit();
        }, 10000);        


    }
});
