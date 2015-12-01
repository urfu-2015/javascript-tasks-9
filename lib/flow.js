'use strict';

module.exports.serial = function (functions, callback) {
    var index = 0;
    var functionsLength = functions.length; // Чтобы не считать каждый раз в callback
    var next = function (error, data) {
        index++;
        if (error || index === functionsLength) {
            callback(error, data);
            return;
        }
        functions[index](data, next);
    };
    functions[index](next);
};

module.exports.parallel = function (functions, callback) {
    var functionsLength = functions.length;
    // Создаем массив, где будем хранить результаты
    // Хотелось бы сделать фиксированной длинны, чтобы
    // в конце, когда берем data[0] там был результат именно первой
    // функции, даже не смотря на то, что вторая могла закончиться
    // быстрее
    // var data = new Array(functionsLength);
    var results = [];
    functions.forEach(function (elem, index) {
        elem(function (error, data) {
            if (error) {
                callback(error, results);
            } else {
                // results[index] = data;
                results.push(data);
            }
            if (index === functionsLength - 1) {
                callback(error, results);
            }
        });
    });
};

module.exports.map = function (values, func, callback) {
    var valuesLength = values.length;
    var results = [];
    values.forEach(function (elem, index) {
        func(elem, function (error, data) {
            if (error) {
                callback(error, results);
            } else {
                // results[index] = data;
                results.push(data);
            }
            if (index === valuesLength - 1) {
                callback(error, results);
            }
        });
    });
};
