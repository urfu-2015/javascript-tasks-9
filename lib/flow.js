'use strict';

module.exports.serial = function (functions, callback) {
    var next = function (error, data) {
        if (functions.length === 0 || error) {
            callback(error, data);
        } else {
            functions.shift()(data, next);
        }
    };
    functions.shift()(next);
};

module.exports.parallel = function (functions, callback) {
    var resultArray = [];
    functions.forEach(function (func, index, functions) {
        func(function (error, data) {
            if (error) {
                callback(error, data);
            }
            resultArray.push(data);
            if (index === functions.length - 1) {
                callback(null, resultArray);
            }
        });
    });
};

module.exports.map = function (values, func, callback) {
    var resultArray = [];

    values.forEach(function (value, index, values) {
        func(value, function (error, data) {
            if (error) {
                callback(error, data);
            }
            resultArray.push(data);
            if (index === values.length - 1) {
                callback(null, resultArray);
            }
        });
    });
};
