'use strict';

exports.serial = serial;
exports.parallel = parallel;
exports.map = map;

function serial(functions, callback) {
    var index = 0;
    var funcsLength = functions.length - 1;
    function serialCallback(error, data) {
        if (!error && index !== funcsLength) {
            functions[++index](data, serialCallback);
        } else {
            callback(error, data);
        }
    }
    if (funcsLength >= 0) {
        functions[0](serialCallback);
    } else {
        callback(null, null);
    }
}

function parallelCallback(callback, results, itemsLength, index) {
    return function (error, data) {
        if (!error) {
            results[index] = data;
        }
        if (index === itemsLength) {
            callback(error, results);
        }
    }
}

function parallel(functions, callback) {
    var results = [];
    var funcsLength = functions.length - 1;
    functions.forEach(function (func, index) {
        func(parallelCallback(callback, results, funcsLength, index));
    });
}

function map (values, func, callback) {
    var results = [];
    var valuesLength = values.length - 1;
    values.forEach(function (value, index) {
        func(value, parallelCallback(callback, results, valuesLength, index));
    });
}
