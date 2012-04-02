// Includes
var mfemale = require('joker/names/female');
var mmale = require('joker/names/male');
var mlast = require('joker/names/last');
var mcities = require('joker/names/cities');
var manimals = require('joker/names/animals');


function random_from(listnames) {
    var max = listnames.length;
    var index = Math.floor(Math.random() * max);
    return listnames[index];
}

function random_male() {
    return random_from(mmale.names);
}

function random_female() {
    return random_from(mfemale.names);
}

function random_first() {
    var is_male = Math.random() % 2;
    return is_male ? random_male() : random_female();
}

function random_last() {
    return random_from(mlast.names);
}

function random_city() {
    return random_from(mcities.cities);
}

function random_animal() {
    return random_from(manimals.animals);
}

function random_name() {
    var first = random_first();
    var last = random_last();
    return first+" "+last;
}

// Exports
exports.random = random_name
exports.random_male = random_male
exports.random_female = random_female
exports.random_first = random_first
exports.random_last = random_last
exports.random_city = random_city