'use strict';

module.exports.serial = function (functions, callback) {
    var cb = function (error, data) {
        if (error || functions.length === 0) {
            callback(error, data);
            return;
        }
        var func = functions.shift();
        func(data, cb);
    };
    functions.shift()(cb);
};

module.exports.parallel = function (functions, callback) {
    var results = [];
    var cb = function (error, data) {
        results.push(data);
        if (error || functions.length === results.length) {
            callback(error, results);
        }
    };
    functions.forEach(function (func) {
        setTimeout(function () {
            func(cb);
        }, 0);
    });
};

module.exports.map = function (values, func, callback) {
    var results = [];
    var cb = function (error, data) {
        results.push(data);
        if (error || values.length === results.length) {
            callback(error, results);
        }
    };
    values.forEach(function (value) {
        setTimeout(function () {
            func(value, cb);
        }, 0);
    });
};
