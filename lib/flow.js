'use strict';
module.exports.serial = function (functions, callback) {
    var index = 0;
    var _callback = function (error, data) {
        if (error || index >= functions.length - 1) {
            callback(error, data);
        } else {
            functions[++index](data, _callback);
        }
    };
    if (functions[0]) {
        functions[0](_callback);
    } else {
        callback(new Error('Array is empty'));
    }
};

module.exports.parallel = function (functions, callback) {
    var results = [];
    var _callback = function (error, data) {
        if (error) {
            callback(error, data);
        } else {
            results.push(data);
        }
        if (results.length === functions.length) {
            callback(error, results);
        }
    };

    if (!functions[0]) {
        callback(new Error('Array is empty'));
    } else {
        functions.forEach(function (item) {
            item(_callback);
        });
    }
};

module.exports.map = function (values, func, callback) {
    var results = [];
    var _callback = function (error, data) {
        if (error) {
            callback(error, results);
        } else {
            results.push(data);
        }
        if (results.length === values.length) {
            callback(error, results);
        }
    };

    if (!values[0]) {
        callback(new Error('Array is empty'));
    } else {
        values.forEach(function (item) {
            func(item, _callback);
        });
    }
};
