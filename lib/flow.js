'use strict';
module.exports.serial = function (funcArray, callback) {
    var count = 0;
    var localCallback = function (error, data) {
        count += 1;
        if (error || count === funcArray.length) {
            callback(error, data);
            return;
        }
        if (count < funcArray.length) {
            funcArray[count](data, localCallback);
        }
    };
    funcArray[0](localCallback);
};

module.exports.parallel = function (funcArray, callback) {
    var results = [];
    var createLocalCallback = function (index) {
        return function (error, data) {
            if (!error) {
                results[index] = data;
            }
            if (error || funcArray.length == results.length) {
                callback(error, results);
            }
        };
    };
    funcArray.forEach(function (func, funcIndex) {
        func(createLocalCallback(funcIndex));
    });
};


module.exports.map = function (values, func, callback) {
    var results = [];
    var index = 0;
    var createLocalCallback = function (index) {
        return function (error, data) {
            if (!error) {
                results[index] = data;
            }
            if (values.length === results.length || error) {
                callback(error, results);
            }
        };
    };
    values.forEach(function (value, valueIndex) {
        func(value, createLocalCallback(valueIndex));
    });
};
