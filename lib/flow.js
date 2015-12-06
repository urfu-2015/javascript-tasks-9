'use strict';

/**
 *Запускает функции в массиве functionArray последовательно.
 *Результат функции передается в следующую.
 *Если любая из функций передает в колбэк ошибку,
 *то следующая не выполняется, а вызывается основной колбэк callback.
 *@param {Array} functionArray массив функций для выполнения
 *@param {Function} callback
 */
module.exports.serial = function (functionArray, callback) {
    if (functionArray.length === 0) {
        return callback(null, null);
    }
    var index = 0;
    var localCallback = function (error, data) {
            if (error) {
                return callback(error, data);
            }
            index++;
            if (index === functionArray.length) {
                return callback(error, data);
            } else {
                functionArray[index](data, localCallback);
            }
        };
    functionArray[index](localCallback);
};

/**
 *запускает функции в массиве параллельно.
 *Результат собираются в массив, который передается в callback при завершении всех функций.
 *@param {Array} functionArray массив функций для выполнения
 *@param {Function} callback
 */
module.exports.parallel = function () {
    var functionArray = arguments[0];
    var callback = arguments.length === 2 ? arguments[1] : arguments[2];
    var limit = arguments.length === 3 ? arguments[1] : Infinity;
    var running = 0;
    var error = null;
    if (functionArray.length === 0 || limit <= 0) {
        return callback(null, []);
    }
    var calls = 0;
    var i = 0;
    var resultArray = [];
    function callFunction() {
        while (running < limit && i < functionArray.length) {
            functionArray[i](function (i) {
                return function (e, data) {
                    if(!error) {
                        error = e;
                    }
                    if (!e) {
                        resultArray[i] = data;
                    }
                    calls++;
                    running--;
                    if (calls === functionArray.length) {
                        return callback(error, resultArray);
                    }
                    callFunction();
                };
            }(i));
            i++;
            running++;
        }
    }
    return callFunction();
};


/**
 *запускает функцию func с каждым значением из argsArray параллельно.
 *Результат собираются в массив,
 *который передается в callback при завершении всех запусков.
 *@param {Array} argsArray массив значений для выполнения func
 *@param {Function} func функция для запуска
 *@param {Function} callback
 */
module.exports.map = function (argsArray, func, callback) {
    if (argsArray.length === 0) {
        return callback(null, []);
    }
    var calls = 0;
    var resultArray = [];
    var error = null;
    for (var i = 0; i < argsArray.length; i++) {
        func(argsArray[i], (function (i) {
            return function (e, data) {
                if(!error) {
                        error = e;
                    }
                    if (!e) {
                    resultArray[i] = data;
                }
                calls++;
                if (calls === argsArray.length) {
                    return callback(error, resultArray);
                }
            };
        }(i)));
    }
};

module.exports.makeAsync = function (func) {
    return function () {
        var data = [];
        for (var i = 0; i < arguments.length - 1; i++) {
            data.push(arguments[i]);
        };
        var callback = arguments[arguments.length - 1];
        setTimeout(function () {
            var result;
            try {
                result = func.apply(null, data);
            } catch (e) {
                return callback(e);
            }
            return callback(null, result);
        }, 0);
    };
};


