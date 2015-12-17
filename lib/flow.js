'use strict';

module.exports.serial = function (functions, callback) {
    if (functions.length === 0) {
        callback(null, null);
        return;
    }
    var i = 0;
    var cb = function (error, data) {
        if (error) {
            return callback(error, data);
        }
        i += 1;
        if (i >= functions.length) {
            return callback(error, data);
        } else {
            functions[i](data, cb);
        }
    };
    functions[i](cb);
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
            counter++;
            if (error || counter === functions.length) {
                callback(error, data);
            } else {
                result.push(data);
            }
            if (i === functions.length - 1) {
                cb(error, result);
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
