'use strict';

module.exports.serial = function (functions, callback) {
    var cb = function (error, data) {
        if (error || functions.length === 0) {
            return callback(error, data);
        }
        var func = functions.shift();
        func(data, cb);
    };
    functions.shift()(cb);
};

module.exports.parallel = function (functions, callback) {
    var results = [];
    var errors = [];
    var cb = function (error, data) {
        if (error) {
            errors.push(error);
        }
        results.push(data);
        if (functions.length === results.length) {
            if (errors.length) {
                return callback(errors, results);
            }
            return callback(null, results);
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
        if (values.length === results.length) {
            return callback(error, results);
        }
    };
    values.forEach(function (value) {
        setTimeout(function () {
            func(value, cb);
        }, 0);
    });
};
