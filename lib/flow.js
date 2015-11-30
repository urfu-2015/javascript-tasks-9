'use strict';

module.exports.serial = function (funcsArray, globalCallback) {
    var funcNumber = -1;
    var oneFunctionCall = function (error, data) {
        if (error) {
            globalCallback(error);
            return;
        }
        funcNumber++;
        if (funcNumber === funcsArray.length) {
            globalCallback(undefined, data);
            return;
        }
        var nowFunc = funcsArray[funcNumber];
        funcNumber === 0 ? nowFunc(oneFunctionCall) : nowFunc(data, oneFunctionCall);
    };
    oneFunctionCall();
};

module.exports.parallel = function (funcsArray, limit, globalCallback) {
    if (funcsArray.length === 0) {
        globalCallback(undefined, []);
        return;
    }
    if (typeof limit === 'function') {
        globalCallback = limit;
        limit = funcsArray.length;
    }
    var answersArray = [];
    var errorsArray = [];
    var executedFuncsCount = 0;
    var startedFuncsCount = 0;
    var getFuncCallback = function (funcNumber) {
        return function (error, data) {
            executedFuncsCount++;
            if (startedFuncsCount < funcsArray.length) {
                setTimeout((function (startedFuncsCount) {
                    funcsArray[startedFuncsCount](getFuncCallback(startedFuncsCount));
                })(startedFuncsCount), 0);
                startedFuncsCount++;
            }
            if (error) {
                errorsArray.push(error);
            } else {
                answersArray[funcNumber] = data;
            }
            if (executedFuncsCount === funcsArray.length) {
                errorsArray.length ? globalCallback(errorsArray) :
                globalCallback(undefined, answersArray);
                return;
            }
        };
    };
    for (startedFuncsCount = 0;
    startedFuncsCount < funcsArray.length && startedFuncsCount < limit;
    startedFuncsCount++) {
        setTimeout((function (startedFuncsCount) {
            funcsArray[startedFuncsCount](getFuncCallback(startedFuncsCount));
        })(startedFuncsCount), 0);
    }
};

module.exports.map = function (valuesArray, func, globalCallback) {
    if (valuesArray.length === 0) {
        globalCallback();
        return;
    }
    var answersArray = [];
    var errorsArray = [];
    var executedFuncsCount = 0;
    var getFuncCallback = function (funcNumber) {
        return function (error, data) {
            executedFuncsCount++;
            if (error) {
                errorsArray.push(error);
            } else {
                answersArray[funcNumber] = data;
            }
            if (executedFuncsCount === valuesArray.length) {
                errorsArray.length ? globalCallback(errorsArray) :
                globalCallback(undefined, answersArray);
                return;
            }
        };
    };
    for (var i = 0; i < valuesArray.length; i++) {
        setTimeout((function (i) {
            func(valuesArray[i], getFuncCallback(i));
        })(i), 0);
    }
};

module.exports.makeAsync = function (syncFunc) {
    return function (argument, callback) {
        try {
            var answer = syncFunc(argument);
            callback(undefined, answer);
        } catch (e) {
            callback(e);
        }
    };
};
