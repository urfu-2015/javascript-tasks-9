'use strict';

module.exports.serial = function (funcs, callback) {
    if (funcs.length == 0) {
        callback();
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
        callback();
    }
    var result = [];
    var errors = [];
    var callBack = function (error, data) {
        if (!error) {
            result.push(data);
        }
        if (funcs.length == result.length) {
            callback(error, result);
        }
    };
    funcs.forEach(function (func) {
        setTimeout(func(callBack), 1);
    });

};

module.exports.map = function (values, func, callback) {
    if (values.length == 0) {
        callback();
    }
    var result = [];
    var callBack = function (error, data) {
        result.push(data);
        if (error || result.length == values.length) {
            callback(error, result);
        }
    };
    values.forEach(function (value, index) {
        setTimeout(func(value, callBack), 1);
    });
};
