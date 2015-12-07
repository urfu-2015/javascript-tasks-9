'use strict';

module.exports.serial = function (funcs, callback) {
    if (funcs.length == 0) {
        callback(null, []);
    }
    var callBack = function (error, data) {
        if (error || funcs.length == 0) {
            callback(error, data);
        } else {
            funcs.shift()(data, callBack);
        }
    };
    funcs.shift()(callBack);
};

module.exports.parallel = function (funcs, callback) {
    if (funcs.length == 0) {
        callback(null, []);
    }
    var result = [];
    var callBack = function (error, data) {
        if (!error) {
            result.push(data);
        }
    };
    funcs.forEach(function (func) {
        setTimeout(func(callBack), 0);
    });

    callback(null, result);
};

module.exports.map = function (values, func, callback) {
    var f = [];
    values.forEach(function (value, index) {
        f.push(func.bind(null, value));
    });
    this.parallel(f, callback);
};
