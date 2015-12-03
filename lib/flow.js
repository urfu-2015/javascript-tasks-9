'use strict';

function serial(functions, callback) {
    if (!functions.length) {
        callback();
        return;
    }
    var i = 0;
    var serialCallback = function (error, result) {
        if (error || i === functions.length - 1) {
            callback(error, result);
            return;
        }
        i++;
        functions[i](result, serialCallback);
    };
    functions[0](serialCallback);
}

function parallel(functions, callback, limit) {
    if (!functions.length) {
        callback();
        return;
    }
    var funcsResults = [];
    var counter = 0;
    var lastError = false;
    var parallelCallback = function (index) {
        return function (error, result) {
            if (error) {
                lastError = error;
            }
            funcsResults[index] = result;
            if (counter === functions.length - 1) {
                callback(error, funcsResults);
            }
            counter++;
        };
    };
    functions.forEach(function (func, index) {
        func(parallelCallback(this, index));
    });
}

function map(values, func, callback) {
    var functions = [];
    values.forEach(function (value) {
        functions.push(func.bind(this, value));
    });
    parallel(functions, callback);
}

function makeAsync(func) {
}

module.exports = {
    serial: serial,
    parallel: parallel,
    map: map,
    makeAsync: makeAsync
};
