'use strict';

var map = module.exports.map;
var serial = module.exports.serial;
var parallel = module.exports.parallel;

module.exports.serial = function (funcArray, callback) {
    if (funcArray.length === 0) {
        return;
    }
    var lostFunction = funcArray.shift();
    lostFunction(function next(error, data) {
        if (error)  {
            callback(error);
        } else {
            lostFunction = funcArray.shift();
            if (funcArray.length === 0) {
                lostFunction(data, callback);
            } else {
                lostFunction(data, next);
            }
        }
    });
};

module.exports.parallel = function (funcArray, callback) {
    var results = [];
    funcArray.forEach(
        (elem, index) => {
            elem(
                (error, data) => {
                    if (error) {
                        callback(error);
                    } else {
                        results.push(data);
                    }
                    if (results.length == funcArray.length) {
                        callback(error, results);
                    }
                }
            )
        }
    );
};


module.exports.map = function (array, func, callback) {
    var results = [];
    array.forEach(
        (elem, index) => {
            func(elem,
                (error, data) => {
                    if (error) {
                        callback(error);
                    } else {
                        results.push(data);
                    }
                    if (results.length == array.length) {
                        callback(error, results);
                    }
                }
            )
        }
    );
};