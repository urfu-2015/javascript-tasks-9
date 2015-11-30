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

module.exports.parallel = function (funcsArray, globalCallback) {
    if (funcsArray.length === 0) {
        globalCallback(undefined, []);
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
            if (executedFuncsCount === funcsArray.length) {
                errorsArray.length ? globalCallback(errorsArray) :
                globalCallback(undefined, answersArray);
                return;
            }
        };
    };
    for (var i = 0; i < funcsArray.length; i++) {
        funcsArray[i](getFuncCallback(i));
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
        func(valuesArray[i], getFuncCallback(i));
    }
};

