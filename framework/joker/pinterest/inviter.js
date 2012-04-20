// #EmailAddresses li input  :last is textarea
// #SendInvites
//

phantom.injectJs('joker/pinterest/base.js');

var PinterestInviter = function(mode,user_account) {
    YahooBase.apply(this);

}

PinterestInviter.prototype = new PinterestBase();


PinterestInviter.prototype.run = function() {

    var par = this;

    var inviteLoaded = function inviteLoaded() {

    
        par.evaluate(function(invites) { 
            for (var invite = 0; i < invites.length; invite++) {
                var i = invite+1;
                $('#EmailAddresses li input:nth-child('+i+')').val(invites[invite]);
            }i
        });
        mutils.clickOnPage('#SendInvites');
    };

    this.page.open(URL_INVITE, inviteLoaded);

}

