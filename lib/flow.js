'use strict';

var Promise = require('bluebird');

/**
 * flow.serial([func1, func2], callback)
 * Функция serial запускает функции в массиве последовательно.
 * Результат функции передается в следующую.
 * Помимо результата предыдущей функции, она получает колбэк.
 * Колбэк принимает первым параметром ошибку, а вторым – данные для следующей функции.
 * Если любая из функций передает в колбэк ошибку, то следующая не выполняется, а вызывается основной колбэк callback.
 */
exports.serial = function(functions, callback) {
    var functionIndex = 0;
    var nextCallback = function (error, data) {
        console.log("next serial");
        if (error || (functionIndex === functions.length - 1)) {
            callback(error, data);
        } else {
            functionIndex++;
            functions[functionIndex](data, nextCallback);
        }
    }

    var firstFunctionPromise = Promise.promisify(functions[0].bind(undefined, nextCallback));
    firstFunctionPromise()
        .then(function(data) {
            callback(null, data);
        })
        .catch(function (error, data) {
            callback(error, data);
        })
}

/**
 * flow.parallel([func1, func2], callback)
 * Функция parallel запускает функции в массиве параллельно.
 * Результат собирается в массив, который передается в основной колбэк при завершении всех функций.
 * Функции принимают колбэк. Колбэк принимает первым параметром ошибку, а вторым – данные для конечного массива.
 */
exports.parallel = function (functions, callback) {
    console.log("start parallel")
    var nextCallback = function (error, data) {
        console.log('nextCallback parallel')
        if (error) {
            callback(error, data);
        }
    }

    var functionsPromises = functions.map(function(func) {
        return Promise.promisify(func.bind(undefined, nextCallback));
    });

    console.log("start all")
    functionsPromises[1]()
    //Promise.all(functionsPromises)
        .then(function(data) {
            console.log('then parallel')
            callback(null, data);
        })
        .catch(function(error) {
            console.log(error)
            callback(error, "");
        });
}

/**
 * flow.map(['value1', 'value2'], func, callback)
 * Функция map запускает функцию с каждым значением параллельно.
 * Функция принимает значение из массива и колбэк.
 * Результат собираются в массив, который передается в основной колбэк при завершении всех запусков.
 */
exports.map = function (params, func, callback) {
    console.log('start map');
    var nextCallback = function (error, data) {
        console.log('nextCallback map')
        console.log(data)
        if (error) {
            callback(error, data);
        }
    }

    var allPromise = params.map( function(parameter) {
        return Promise.promisify(func.bind(undefined, parameter, nextCallback));
    });

    //allPromise[0]()
    Promise.all(allPromise)
        .then(function(data) {
            console.log('start then map');
            callback(false, data);
            console.log('end then map')
        })
        .catch(function(error) {
            console.log('start catch map');
            callback(error, "");
        })
}