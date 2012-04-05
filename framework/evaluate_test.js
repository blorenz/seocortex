var page = new WebPage();

var mdata = {
    key1 : "value1", 
    key2 : "value2"
};

var json = JSON.stringify(mdata);

var result = page.evaluate(function(data) {
    return data.key1;
}, json);


console.log("result = "+result);