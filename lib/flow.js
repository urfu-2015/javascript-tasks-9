'use strict';

module.exports.serial = function (functions, callback) {
    var i = 0;
    var cb = function (error, data) {
        if (error || i >= functions.length - 1) {
            callback(error, data);
        } else {
            i += 1;
            functions[i](data, cb);
        }
    };
    functions[i](cb);
};

module.exports.parallel = function (functions, callback) {
    var result = [];
    functions.forEach(function (func, i) {
        func(function (error, data) {
            if (error) {
                callback(error, data);
            } else {
                results.push(data);
            }
            if (i === functions.length - 1) {
                cb(error, result);
            }
        });
    });
};

module.exports.map = function (value, func, callback) {
    var result = [];
    values.forEach(function (value, i) {
        func(value, function (error, data) {
            if (error) {
                callback(error, data);
            } else {
                result.push(data);
            }
            if (i === values.length - 1) {
                callback(error, result);
            }
        });
    });
};
