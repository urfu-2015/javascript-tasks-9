'use strict';

function serial(funcArr, callback) {
    if (funcArr.length === 0) {
        return;
    }
    var i = 0;
    var serialCallback = function (error, result) {
        if (error || i >= funcArr.length - 1) {
            callback(error, result);
            return;
        }
        i++;
        funcArr[i](result, serialCallback);
    };
    funcArr[0](serialCallback);
}

function parallel(funcArr, callback) {
    if (funcArr.length === 0) {
        return;
    }
    var funcResults = [];
    var i = 0;
    var parallelCallback = function (error, result) {
        if (error) {
            callback(error, funcResults);
        }
        funcResults.push(result);
        if (i === funcArr.length - 1) {
            callback(error, funcResults);
        }
        i++;
    };
    for (var j = 0; j < funcArr.length; j++) {
        setTimeout((function (j) {
            funcArr[j](parallelCallback);
        })(j), 0);
    }
}

function map(valueArr, func, callback) {
    var funcResults = [];
    var i = 0;
    var mapCallback = function (error, result) {
        if (error) {
            callback(error, funcResults);
        }
        funcResults.push(result);
        if (i === valueArr.length - 1) {
            callback(error, funcResults);
        }
        i++;
    };
    for (var j = 0; j < valueArr.length; j++) {
        setTimeout((function (j) {
            func(valueArr[j], mapCallback);
        })(j), 0);
    }
}

module.exports = {
    serial: serial,
    parallel: parallel,
    map: map
};
