'use strict';

module.exports.serial = function (functions, callback) {
    emptyArray(functions, callback, "");
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
    var result = [];
    emptyArray(functions, callback, result);
    var errors = false;
    var myCallback = function (error, data) {
        if (errors) {
            return;
        } else if (error && !errors) {
            errors = true;
            callback(error, result);
        } else {
            result.push(data);
        }
        if (result.length === functions.length && !errors) {
            callback(error, result);

        }
    };
    functions.forEach(function (func) {
        func(myCallback);
    });

};

module.exports.map = function (values, func, callback) {
    var functions = [];
    emptyArray(values, callback, []);
    values.forEach(function (val) {
        functions.push(func.bind(null, val));
    });
    this.parallel(functions, callback);
};

function emptyArray(array, callback, result) {
    if (!array.length) {
        callback(null, result);
    }
};
