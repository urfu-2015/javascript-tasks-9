'use strict';
module.exports.serial = function (functions, callback) {
    var index = 0;
    var _callback = function (error, data) {
        if (error) {
            callback(error, data);
        } else {
            if (index < functions.length - 1) {
                functions[++index](data, _callback);
            } else {
                callback(error, data);
            }
        }
    };
    if (functions[0]) {
        functions[0](_callback);
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
    functions.forEach(function (item) {
        item(_callback);
    });
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

    values.forEach(function (item) {
        func(item, _callback);
    });
};
