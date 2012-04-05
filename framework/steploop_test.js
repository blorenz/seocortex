// Includes
var mstep = require('spooky/sync/step');

var counter = 10;
mstep.Step(
    function firstStep() {
        console.log("Block 1 !");
        return null;
    },
    function secondStep() {
        console.log("Block 2 !");
        return null;
    },
    function loop() {
        counter -= 1;
        return null;
    }
); 
