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

function randomMale() {
    return random_from(mmale.names);
}

function randomFemale() {
    return random_from(mfemale.names);
}

function randomFirst() {
    var is_male = Math.random() % 2;
    return is_male ? randomMale() : randomFemale();
}

function randomLast() {
    return random_from(mlast.names);
}

function randomCity() {
    return random_from(mcities.cities);
}

function randomAnimal() {
    return random_from(manimals.animals);
}

function randomName() {
    var first = randomFirst();
    var last = randomLast();
    return first+" "+last;
}

// Exports
exports.random = randomName
exports.randomName = randomName
exports.randomMale = randomMale
exports.randomFemale = randomFemale
exports.randomFirst = randomFirst
exports.randomLast = randomLast
exports.randomCity = randomCity