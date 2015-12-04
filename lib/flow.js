'use strict';

exports.serial = (funcs, callback) => {
    if (funcs.length === 0) {
        callback(null);
    } else {
        var next = (error, data) => {
            if (error || funcs.length === 0) {
                callback(error, data);
            } else {
                funcs.shift()(data, next);
            }
        };
        funcs.shift()(next);
    }
};

// y-комбинатор
var yCombinator = functional =>
    (fun => functional(arg => fun(fun)(arg)))
    (fun => functional(arg => fun(fun)(arg)));

exports.parallel = (funcs, limit, callback) => {
    if (!callback) {
        callback = limit;
        limit = funcs.length;
    }
    if (funcs.length === 0) {
        callback(null, []);
    } else {
        var result = [];
        var lastError = null;
        var runningCount = 0;
        var funcCount = funcs.length;
        var initialCount = Math.min(limit, funcCount);
        var nextIdx = initialCount;
        // в цикле делаем первоначальный запуск функций, не превышающих по числу limit
        for (var i = 0; i < initialCount; i++) {
            // используем Y-комбинатор для запуска анонимной функции рекурсивно
            // recursive — это параметр, содержащий саму функцию запуска,
            // чтобы она могла вызвать себя рекурсивно
            (yCombinator(recursive => {
                // функционал для Y-комбинатора, возвращает функцию запуска
                return (calledIdx) => {
                    // calledIdx — номер функции по порядку, сохраняем его,
                    // чтобы знать, в какой элемент массива записать результат
                    // проверяем, что не вышли за границу массива
                    if (calledIdx < funcCount) {
                        // увеличиваем счётчик одновременно выполняющихся функций
                        runningCount++;
                        // выкидываем из массива функций первую и запускаем её
                        funcs.shift()((error, data) => {
                            // в этот коллбэк попадаем, когда функция завершилась
                            // увеличиваем счётчик одновременно выполняющихся функций
                            runningCount--;
                            // сохраняем результат выполнения функции
                            result[calledIdx] = data;
                            // если была ошибка, сохраняем и её
                            if (error) {
                                lastError = error;
                            }
                            // если это была последняя функция
                            // (т.е. нет больше функций в массиве,
                            // и нет запущенных в данный момент функций)
                            if (funcs.length === 0 && runningCount === 0) {
                                // вызываем основной коллбэк
                                callback(lastError, result);
                            } else {
                                // рекурсивный вызов — для запуска следующей на очереди функции
                                recursive(nextIdx++);
                            }
                        });
                    }
                };
            }))(i);
        }
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
            next(e);
        }
    };
};
