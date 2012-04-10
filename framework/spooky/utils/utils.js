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

function waitForWithParam(testFx, param, onReady, timeOutMillis, hammerTime) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
        maxHammerTime = hammerTime ? hammerTime : 250,
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx(param)); //< defensive code
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


function spinForWithParam(onReady, param, timeOutMillis, hammerTime) {
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
                    typeof(onReady) === "string" ? eval(onReady) : onReady(param); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    //console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(param); //< Do what it's supposed to do once the condition is fulfilled
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


var parseURL = function(url) {
    var dict = {};
    var url_parts = url.split('?');

    // Query string
    dict.url = url_parts[0];
    dict.query_string = url_parts[1] ? url_parts : '';

    // Protocol
    var proto_parts = dict.url.split('://', 1)
    proto_parts = proto_parts.length === 2 ? proto_parts : ['http', dict.url];
    dict.protocol = proto_parts[0];
    dict.full_path = proto_parts[1];

    // Path
    var path_parts = dict.full_path.split('/');
    dict.domain = path_parts[0];
    dict.path = path_parts.slice(1).join('/')

    return dict;
}



// Parse a querystring to an object
var parseQS = function(querystring) {
    var dict = {};

    // Handle incorrect query strings
    try {
        var vars = querystring.split('&');
        for(i = 0; i < vars.length; i++) {
            try {
                    var pair = vars[i].split("=");
                    var key = pair[0] ? pair[0] : undefined;
                    var value = pair[1] ? pair[1] : '';
                    key = decodeURIComponent(key);
                    value = decodeURIComponent(value);
                    dict[key] = value;                  
            } catch(error) {
                continue;
            }
        }
    } catch(error) {
        dict = {};
    }
    return dict;
}

// requires jquery on the page!
var clickOnPage = function(page,selector) {
   var el = page.evaluate(function(sel) {
               var offset = $(sel).offset(); 
               return [offset.left,offset.top];
   }, JSON.stringify(selector));
   page.sendEvent('click',el[0],el[1]);
};

var getURI = function(page) {
    return page.evaluate(function () { return document.baseURI;  });
};

var screenshot = function(page,path) {
    page.render(path);
}

// Changes XML to JSON
function xmlToJson(xml) {
    
    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        for(var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof(obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof(obj[nodeName].length) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
};

// Exports
exports.waitForWithParam = waitForWithParam
exports.waitFor = waitFor
exports.spinForWithParam = spinForWithParam
exports.spinFor = spinFor
exports.randomInt = randomInt
exports.randomString = randomString
exports.clickOnPage = clickOnPage
exports.parseQS = parseQS
exports.parseURL = parseURL
exports.getURI = getURI
exports.screenshot = screenshot
exports.xmlToJson = xmlToJson

