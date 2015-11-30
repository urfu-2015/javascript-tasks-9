'use strict';

exports.serial = function (funcs, callBack) {
    var idx = 0;
    var next = (error, data) => {
        if (error || idx === funcs.length) {
            callBack(error, data);
        } else {
            funcs[idx++](data, next);
        }
    };
    funcs[idx++](next);
};

var nextGenGen = (total, runContext, cbAllReady, cbOneReady) => {
    var finishCount = 0;
    var lastError = null;
    var results = [];
    return (idx) => {
        return (error, data) => {
            results[idx] = data;
            if (error) {
                lastError = error;
            }
            finishCount++;
            runContext.running--;
            if (finishCount === total) {
                cbAllReady(lastError, results);
            } else if (cbOneReady) {
                cbOneReady();
            }
        };
    };
};

var fillRunningFunctions = function (runContext, limit, total, funRunner) {
    while (runContext.running < limit && runContext.nextIdx < total) {
        funRunner(runContext.nextIdx++);
    }
};

exports.parallel = function () {
    var funcs = arguments[0];
    var limit;
    var callback;
    if (arguments.length === 2) {
        limit = funcs.length;
        callback = arguments[1];
    } else if (arguments.length === 3) {
        limit = arguments[1];
        callback = arguments[2];
    }
    var runContext = {
        running: 0,
        nextIdx: 0
    };
    var cbFillRunningFunctions =
        () => fillRunningFunctions(runContext, limit, funcs.length, function (idx) {
            funcs[idx](nextGen(idx));
            runContext.running++;
        });
    var nextGen = nextGenGen(funcs.length, runContext, callback, cbFillRunningFunctions);
    cbFillRunningFunctions();
};

exports.map = function map(values, func, callBack) {
    exports.parallel(values.map(value => (next) => func(value, next)), callBack);
};

exports.makeAsync = function (func) {
    return (data, next) => {
        next(null, func(data));
    };
};
