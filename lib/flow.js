'use strict';

exports.serial = (funcs, callback) => {
    var idx = 0;
    if (funcs.length === 0) {
        callback();
    } else {
        var next = (error, data) => {
            if (error || idx === funcs.length) {
                callback(error, data);
            } else {
                funcs[idx++](data, next);
            }
        };
        funcs[idx++](next);
    }
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

var fillRunningFunctions = (runContext, limit, total, funRunner) => {
    while (runContext.running < limit && runContext.nextIdx < total) {
        funRunner(runContext.nextIdx++);
    }
};

exports.parallel = (funcs, limit, callback) => {
    if (!callback) {
        callback = limit;
        limit = funcs.length;
    }
    if (funcs.length === 0) {
        callback();
    } else {
        var runContext = {
            running: 0,
            nextIdx: 0
        };
        var cbFillRunningFunctions = () =>
            fillRunningFunctions(runContext, limit, funcs.length, (idx) => {
                funcs[idx](nextGen(idx));
                runContext.running++;
            });
        var nextGen = nextGenGen(funcs.length, runContext, callback, cbFillRunningFunctions);
        cbFillRunningFunctions();
    }
};

exports.map = (values, func, callback) => {
    exports.parallel(values.map(value => (next) => func(value, next)), callback);
};

exports.makeAsync = (func) => {
    return (data, next) => {
        if (!next) {
            next = data;
        }
        try {
            next(null, func(data));
        } catch (e) {
            next(e.message);
        }
    };
};
