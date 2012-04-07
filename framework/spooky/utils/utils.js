// Includes
// None :)

// Consts
var DEFAULT_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
var DEFAULT_LENGTH = 16;


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
    maxInt = maxInt ? maxInt : 2000000000;
    return Math.floor(Math.random() * maxInt);
} 



var randomString = function(length, charset) {
    length = length ? length : DEFAULT_LENGTH;
    charset = charset ? charset : DEFAULT_CHARS;

    var result = '';
    for (var i=0; i < length; i++) {
        result += charset[randomInt(charset.length)];
    }

    return result;
}


// requires jquery on the page!
var clickOnPage = function(page,selector) {
   var el = page.evaluate(function(sel) {
               var offset = $(sel).offset(); 
               return [offset.left,offset.top];
   }, JSON.stringify(selector));
   page.sendEvent('click',el[0],el[1]);
};


// Exports
exports.waitFor = waitFor
exports.spinFor = spinFor
exports.randomInt = randomInt
exports.randomString = randomString
