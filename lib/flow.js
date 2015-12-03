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
    var index = 0;
    var localCallback = function (error, data) {
            if (error) {
                callback(error, data);
                return;
            }
            index++;
            if (index === functionArray.length) {
                callback(error, data);
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
module.exports.parallel = function (functionArray, callback) {
    var calls = 0;
    var resultArray = [];
    for (var i = 0; i < functionArray.length; i++) {
        functionArray[i](function (i) {
            return function (error, data) {
                if (!error) {
                    resultArray[i] = data;
                }
                calls++;
                if (calls === functionArray.length) {
                    callback(error, resultArray);
                }
            };
        }(i));
    }
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
    var calls = 0;
    var resultArray = [];
    for (var i = 0; i < argsArray.length; i++) {
        func(argsArray[i], (function (i) {
            return function (error, data) {
                if (!error) {
                    resultArray[i] = data;
                }
                calls++;
                if (calls === argsArray.length) {
                    callback(error, resultArray);
                }
            };
        }(i)));
    }
};
