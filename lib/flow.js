'use strict';

exports.serial = function (functions, callback) {
    var count = 0;
    var next = function (err, data) {
        count++;
        if (functions.length == count || err) {
            callback(err, data);
        } else {
            functions[count](data, next);
        }
    };
    functions[count](next);
};

exports.parallel = function (functions, callback) {
    var result = [];
    functions.forEach(function (func, index, functions) {
        func(function (err, data) {
            if (err) {
                callback(err, data);
            } else {
                result.push(data);
            }
            if (functions.length - 1 == index) {
                callback(err, result);
            }
        });
    });
};

exports.map = function (values, func, callback) {
    var result = [];
    values.forEach(function (value, index, values) {
        func(value, function (err, data) {
            if (err) {
                callback(err, data);
            } else {
                result.push(data);
            }
            if (index == values.length - 1) {
                callback(null, result);
            }
        });
    });
};
