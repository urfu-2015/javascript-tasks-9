'use strict';
module.exports.serial = function (funcArray, callback) {
    var index = 0;
    var localCallback = function (error, data) {
        index += 1;
        if (error || index === funcArray.length) {
            callback(error, data);
            return;
        }
        var nextFunk = funcArray[index];
        nextFunk(data, localCallback);
    };
    funcArray[0](localCallback);
};

module.exports.parallel = function (funcArray, callback) {
    var results = [];
    var localCallback = function (error, data) {
        if (!error) {
            results.push(data);
        }
        if (error || funcArray.length == results.length) {

            callback(error, results);
        }
    };
    funcArray.forEach(function (func) {
        func(localCallback);
    });
};


module.exports.map = function (values, func, callback) {
    var results = [];
    var localCallback = function (error, data) {
        if (!error) {
            results.push(data);
        }
        if (values.length === results.length || error) {
            callback(error, results);
        }
    };
    values.forEach(function (value) {
        func(value, localCallback);
    });
};
