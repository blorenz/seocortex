// Includes
var mserver =  require('spooky/server/server')
var msdbc = require('joker/services/dbc');


// Server
var url_map = {
    "^/dbc/solveURL" : new msdbc.SolveURL(),
    "^/dbc/solveFilename" : new msdbc.SolveFilename(),
}


// Run it
var s = new mserver.Server(15001, url_map)
s.run()
