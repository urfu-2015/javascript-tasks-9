'use strict';

module.exports.serial = function (functions, callback) {
    if (functions.length === 0) {
        callback(null, []);
        return;
    }
    var index = 0;
    var next = function (error, data) {
        if (functions.length - 1 === index || error) {
            callback(error, data);
        } else {
            functions[++index](data, next);
        }
    };
    functions[0](next);
};

module.exports.parallel = function (functions, callback) {
    if (functions.length === 0) {
        callback(null, []);
        return;
    }
    var result = [];
    functions.forEach(function (func, index, functions) {
        func(function (error, data) {
            if (error) {
                callback(error, data);
            } else {
                result.push(data);
            }
            if (result.length === functions.length) {
                callback(null, result);
            }
        });
    });
};

module.exports.map = function (values, func, callback) {
    if (values.length === 0) {
        callback(null, []);
        return;
    }
    var functions = values.map(function (value) {
        return function (callback) {
            func(value, callback);
        };
    });
    this.parallel(functions, callback);
};
