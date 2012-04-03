// Includes
var mstep = require('spooky/sync/step');


// Run in order
mstep.Step(
    function() {
        console.log("Step 1");
    },
    function() {
        console.log("Step 2");
    },
    function() {
        console.log("Step 3 and last");
        phantom.exit();
    }
);
