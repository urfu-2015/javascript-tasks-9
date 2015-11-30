'use strict';

/**
 * @author Savi
 *
 * Данная функция запускает функции в массиве последовательно.
 * Результат функции передается в следующую.
 * Помимо результата предыдущей функции, она получает колбэк.
 * Колбэк принимает первым параметром ошибку, а вторым – данные для следующей функции.
 * Если любая из функций передает в колбэк ошибку, то следующая не выполняется,
 * а вызывается основной колбэк callback.
 *
 * @param {array} functions
 * @param {function} cb
 */
module.exports.serial = function (functions, cb) {
    var _cb = function (error, data) {
        if (error || functions.length === 0) {
            cb(error, data);
        } else {
            var curFunc = functions.shift();
            curFunc(data, _cb);
        }
    };

    var startFunc = functions.shift();
    startFunc(_cb);
};

/**
 * @author Savi
 *
 * Данная функция запускает функции в массиве параллельно.
 * Результат собираются в массив, который передается в основной колбэк при завершении всех функций.
 * Функции принимают колбэк. Колбэк принимает первым параметром ошибку,
 * а вторым – данные для конечного массива.
 *
 * @param {array} functions
 * @param {function} cb
 */
module.exports.parallel = function (functions, cb) {
    var results = [];

    functions.forEach(function (func, ind) {
        func(function (error, data) {
            if (error) {
                cb(error, data);
            } else {
                results.push(data);
            }
            if (ind === functions.length - 1) {
                cb(error, results);
            }
        });
    });
};

/**
 * @author Savi
 *
 * Данная функция запускает функцию с каждым значением параллельно.
 * Функция принимает значение из массива и колбэк.
 * Результат собираются в массив, который передается в основной колбэк при завершении всех запусков.
 *
 * @param {array} values
 * @param {function} func
 * @param {function} cb
 */
module.exports.map = function (values, func, cb) {
    var results = [];

    values.forEach(function (value, ind) {
        func(value, function (error, data) {
            if (error) {
                cb(error, data);
            } else {
                results.push(data);
            }
            if (ind === values.length - 1) {
                cb(error, results);
            }
        });
    });
};
