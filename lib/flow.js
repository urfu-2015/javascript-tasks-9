'use strict';

module.exports.serial = function (functions, callback) {
    emptyArray(functions, callback);
    var func;
    var myCallback = function (error, data) {
        if (error || !functions.length) {
            callback(error, data);
        } else {
            func = functions.shift();
            func(data, myCallback);
        }
    };
    func = functions.shift();

    func(myCallback);

};

module.exports.parallel = function (functions, callback) {
    emptyArray(functions, callback);
    var result = [];
    var errors = true;
    var myCallback = function (error, data) {
        result.push(data);
        if (error) {
            errors = false;
            callback(error, result);
        } else if (result.length === functions.length) {
            callback(error, result);

        }
    };
    functions.forEach(function (func) {
        if (errors) {
            func(myCallback);
        }
    });

};

module.exports.map = function (values, func, callback) {
    emptyArray(values, callback);
    var functions = [];
    values.forEach(function (val) {
        functions.push(func.bind(null, val));
    });
    this.parallel(functions, callback);
};

function emptyArray(array, callback) {
    if (!array.length) {
        callback(error, result);
    }
};
