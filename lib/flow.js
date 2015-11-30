'use strict';

/**
 *Запускает функции в массиве последовательно. Результат функции передается в следующую.
 *Помимо результата предыдущей функции, она получает колбэк.
 *Колбэк принимает первым параметром ошибку, а вторым – данные для следующей функции.
 *Если любая из функций передает в колбэк ошибку,
 *то следующая не выполняется, а вызывается основной колбэк callback.
 */
module.exports.serial = function (functionArray, callback) {
    var index = 0;
    var localCallback = function (error, data) {
            if (error) {
                callback(error, data);
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
 *Результат собираются в массив, который передается в основной колбэк при завершении всех функций.
 *Функции принимают колбэк.
 *Колбэк принимает первым параметром ошибку, а вторым – данные для конечного массива.
 */
module.exports.parallel = function (functionArray, callback) {
    var calls = 0;
    var resultArray = [];
    for (var i = 0; i < functionArray.length; i++) {
        functionArray[i](function (error, data) {
            if (error) {
                console.log('parallel');
                callback(error, resultArray);
            }
            resultArray.push(data);
            calls++;
            if (calls === functionArray.length) {
                callback(error, resultArray);
            }
        });
    }
};


/**
 *запускает функцию с каждым значением параллельно.
 *Функция принимает значение из массива и колбэк.
 *Результат собираются в массив,
 *который передается в основной колбэк при завершении всех запусков.
 */
module.exports.map = function (argsArray, func, callback) {
    var calls = 0;
    var resultArray = [];
    for (var i = 0; i < argsArray.length; i++) {
        func(argsArray[i], function (error, data) {
            if (error) {
                callback(error, resultArray);
            }
            resultArray.push(data);
            calls++;
            if (calls === argsArray.length) {
                callback(error, resultArray);
            }
        });
    }
};
