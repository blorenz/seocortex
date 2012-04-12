phantom.injectJs('joker/pinterest/base.js');

var PinterestAccountCreator = function(mode,user_account) {
    YahooBase.apply(this);

    // YahooEmailChecker specifics
    this.userAccount = user_account ? user_account : new Object();
    this.twitterActivationLink = null;
    this.twitterAccountInfo = null;
}

PinterestAccountCreator.prototype = new PinterestBase();


PinterestAccountCreator.prototype.run = function() {

     
    // Goes to pinterest page
    // $('#SignUp p a:first')  for twitter  HARD CLICK
    // On twitter page:
    // $('#username_or_email')  and $('#password')  then $('#allow') is button x2 (actually did it in 1)
    // $('#id_username') $('#id_email') $('#id_password') $('#CompleteSignupButton').removeClass('disabled')
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
    //
    // $('a.BigButton.BlueButton') HARD CLICK

}

var login = function (page,l,p,u) {
    // Here is the magic! new evaluate param takes a secondary argument.  ideally a JSON object, but a string for this purpose
    ret = page.evaluate( function(param) {
            eval(param);
          $('#id_password').val(user.password);
          $('#id_email').val(user.name);
          $('#id_username').val(user.profilename);
          $('form.CompleteAccount').submit();
        },'user={name:"'+l+'",password:"'+p+'",username:"'+u+'"}');
//
////
//  Verify here!!!!!  Verify here!!!!!  Verify here!!!!!  Verify here!!!!!  Verify here!!!!!
  //page.render('/var/www/html/fewdalism.com/phantomjs/screen2.png');
};


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
