'use strict';

/**
 * flow.serial([func1, func2], callback)
 * Функция serial запускает функции в массиве последовательно.
 * Результат функции передается в следующую.
 * Помимо результата предыдущей функции, она получает колбэк.
 * Колбэк принимает первым параметром ошибку, а вторым – данные для следующей функции.
 * Если любая из функций передает в колбэк ошибку, то следующая не выполняется,
 * а вызывается основной колбэк callback.
 */
exports.serial = function (functions, callback) {
    if (functions.length === 0) {
        callback(null, []);
        return;
    }

    var functionIndex = 0;
    var nextCallback = function (error, data) {
        if (error || (functionIndex === functions.length - 1)) {
            callback(error, data);
        } else {
            functionIndex++;
            functions[functionIndex](data, nextCallback);
        }
    };
    functions[0](nextCallback);
};

/**
 * flow.parallel([func1, func2], callback)
 * Функция parallel запускает функции в массиве параллельно.
 * Результат собирается в массив, который передается в основной колбэк при завершении всех функций.
 * Функции принимают колбэк. Колбэк принимает первым параметром ошибку,
 * а вторым – данные для конечного массива.
 */
exports.parallel = function (functions, callback) {
    if (functions.length === 0) {
        callback(null, []);
        return;
    }

    var result = [];
    var doneFunctions = 0;
    var indexes = functions.map(function (func, index) {
        return index;
    });

    indexes.forEach(function (index) {
        var nextCallback = function (error, data) {
            doneFunctions++;
            result[index] = data;
            if (error || doneFunctions === functions.length) {
                callback(error, result);
            }
        };
        functions[index](nextCallback);
    });
};

/**
 * flow.map(['value1', 'value2'], func, callback)
 * Функция map запускает функцию с каждым значением параллельно.
 * Функция принимает значение из массива и колбэк.
 * Результат собираются в массив, который передается в основной колбэк при завершении всех запусков.
 */
exports.map = function (params, func, callback) {
    var functionWithParams = params.map(function (parameter) {
        return function (callback) {
            func(parameter, callback);
        };
    });
    module.exports.parallel(functionWithParams, callback);
};
