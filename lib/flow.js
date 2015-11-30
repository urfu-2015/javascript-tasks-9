'use strict';

module.exports.serial = function (functions, callback) {
    var functionIndex = 0;
    var serialCallback = function (error, data) {
        functionIndex++;
        if (error || functionIndex === functions.length) {
            callback(error, data);
            return;
        }
        functions[functionIndex](data, serialCallback);
    };
    functions[0](serialCallback);
};

module.exports.parallel = function (functions, callback) {
    var functionsCount = 0;
    var resultArray = [];
    var parallelCallback = function (error, data) {
        if (error) {
            callback(error, resultArray);
            return;
        }
        functionsCount++;
        resultArray.push(data);
        if (functionsCount === functions.length) {
            callback(error, resultArray);
        }
    };
    functions.forEach(function (func) {
        func(parallelCallback);
    });
};


module.exports.map = function (values, func, callback) {
    var functionsCount = 0;
    var resultArray = [];
    var parallelCallback = function (error, data) {
        if (error) {
            callback(error, resultArray);
            return;
        }
        functionsCount++;
        resultArray.push(data);
        if (functionsCount === values.length) {
            callback(error, resultArray);
        }
    };
    values.forEach(function (value) {
        func(value, parallelCallback);
    });
};
