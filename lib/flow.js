'use strict';

module.exports.serial = function (functions, callback) {
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
    var myCallback = function (error, data) {
        result.push(data);
        if (error || result.length === functions.length) {
            callback(error, result);
        }
    };
    functions.forEach(function (func) {
        func(myCallback);
    });

};

module.exports.map = function (values, func, callback) {
    var functions = [];
    values.forEach(function (val) {
        functions.push(func.bind(null, val));
    });
    this.parallel(functions, callback);
};
