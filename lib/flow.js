'use strict';

function serial(functions, callback) {
    var funcIdx = 0;
    var startNewFunction;
    var localCallback = function (error, data) {
        funcIdx++;
        if (error || funcIdx === functions.length) {
            callback(error, data);
            return;
        }

        startNewFunction(funcIdx, data);
    };
    startNewFunction = function (idx, data) {
        var currentFunction = functions[idx];
        if (currentFunction.length === 1) {
            currentFunction(localCallback);
        } else {
            currentFunction(data, localCallback);
        }
    };

    startNewFunction(0, undefined);
}

function parallel(functions, callback) {
    var resultArray = [];
    var counter = 0;

    var createCallback = function (index) {
        return function (error, data) {
            if (!error) {
                resultArray[index] = data;
            }

            counter++;
            if (counter === functions.length || error) {
                callback(error, resultArray);
            }
        };
    };

    for (var i = 0; i < functions.length; i++) {
        functions[i](createCallback(i));
    }
}

function map(values, func, callback) {
    var resultArray = [];
    var counter = 0;

    var createCallback = function (index) {
        return function (error, data) {
            if (!error) {
                resultArray[index] = data;
            }

            counter++;
            if (counter === values.length || error) {
                callback(error, resultArray);
            }
        };
    };

    for (var i = 0; i < values.length; i++) {
        func(values[i], createCallback(i));
    }
}

exports.serial = serial;
exports.parallel = parallel;
exports.map = map;
