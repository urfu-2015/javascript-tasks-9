'use strict';

module.exports.serial = function (functions, callback) {
    if (functions.length === 0) {
        callback(null, null);
        return;
    }
    var counter = 0;
    var cb = function (error, data) {
        if (error) {
            return callback(error, data);
        }
        counter += 1;
        if (counter >= functions.length) {
            return callback(error, data);
        }
        functions[counter](data, cb);
    };
    functions[counter](cb);
};

module.exports.parallel = function (functions, callback) {
    if (functions.length === 0) {
        callback(null, null);
        return;
    }
    var counter = 0;
    var result = [];
    functions.forEach(function (func, i) {
        func(function (error, data) {
            if (error) {
                callback(error);
            } else if (counter >= functions.length) {
                callback(null, result)
            } else {
                counter += 1;
                result.push(data);
            }
        });
    });
};

module.exports.map = function (values, func, callback) {
    var result = [];
    var counter = 0;
    var flag = false;
    var cb = function (index) {
        return function (error, data) {
            counter += 1;
            result[index] = data;
            if (flag) {
                return;
            }
            if (error || counter === values.length) {
                flag = true;
                callback(error, result);
            }
        };
    };
    for (var i = 0; i < values.length; i++) {
        func(values[i], cb(i));
    }
};
