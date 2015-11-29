'use strict';
var map = module.exports.map;
var serial = module.exports.serial;
var parallel = module.exports.parallel;

module.exports.serial = function (funcArray, callback) {
    var otherFunctions;
    if (1 < funcArray.length) {
        otherFunctions = funcArray.splice(1, funcArray.length - 1);
    } else if (funcArray.length == 0) {
        return;
    }
    funcArray[0](function next(error, data) {
        if (!error) {
            var lost = otherFunctions[0];
            var lastFunction = false;
            if (otherFunctions > 1) {
                otherFunctions = otherFunctions.splice(
                    1, otherFunctions.length - 1);
            } else {
                lastFunction = true;
            }
            if (lastFunction) {
                lost(data, callback);
            } else {
                lost(data, next);
            }
        } else {
            callback(error);
        }
    });
};

module.exports.parallel = function (funcArray, callback) {
    var results = [];
    funcArray.forEach(
        function (elem, index) {
            elem(
                function next(error, data) {
                    if (!error) {
                        results.push(data);
                    } else {
                        callback(error);
                    }
                    if (results.length == funcArray.length) {
                        callback(error, results);
                    }
                }
            );
        }
    );
};

module.exports.map = function (array, func, callback) {
    var results = [];
    array.forEach(
        function (elem, index) {
            func(elem,
                function next(error, data) {
                    if (!error) {
                        results.push(data);
                    } else {
                        callback(error);
                    }
                    if (results.length == array.length) {
                        callback(error, results);
                    }
                }
            );
        }
    );
};


