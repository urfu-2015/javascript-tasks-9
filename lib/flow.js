'use strict';

function serial(functions, errorCallback) {
    var funcIdx = 0;
    var startNewFunction;
    var localCallback = function (error, data) {
        if (error || funcIdx === functions.length - 1) {
            errorCallback(error, data);
            return;
        }

        funcIdx++;
        startNewFunction(funcIdx, data);
    };
    startNewFunction = function (idx, data) {
        setTimeout(function () {
            if (functions[idx].length === 1) {
                functions[idx](localCallback);
            } else {
                functions[idx](data, localCallback);
            }
        }, 0);
    };

    startNewFunction(0, undefined);
}

function parallel(functions, callback) {
    var resultArray = [];

    var localCallback = function (error, data) {
        if (!error) {
            resultArray.push(data);
        }

        if (resultArray.length === functions.length || error) {
            callback(error, resultArray);
        }
    };

    var startNewFunction = function (idx) {
        setTimeout(function () {
            functions[idx](localCallback);
        }, 0);
    };

    for (var i = 0; i < functions.length; i++) {
        startNewFunction(i);
    }
}

function map(values, func, callback) {
    var resultArray = [];

    var localCallback = function (error, data) {
        if (!error) {
            resultArray.push(data);
        }

        if (resultArray.length === values.length || error) {
            callback(error, resultArray);
        }
    };

    var startNewFunction = function (idx) {
        setTimeout(function () {
            func(values[idx], localCallback);
        }, 0);
    };

    for (var i = 0; i < values.length; i++) {
        startNewFunction(i);
    }
}

exports.serial = serial;
exports.parallel = parallel;
exports.map = map;
