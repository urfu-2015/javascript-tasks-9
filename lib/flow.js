'use strict';

module.exports.serial = function (functions, callback) {
    var index = 0;
    var functionsLength = functions.length; // Чтобы не считать каждый раз в callback
    functions[index](function next (error, data) {
        if (error || index === functionsLength - 1) {
            callback(error, data)
        }
        index++;
        if (index < functionsLength) {
            functions[index](data, next);
        }
    });
};

module.exports.parallel = function (functions, callback) {
    var functionsLength = functions.length;
    // Создаем массив, где будем хранить результаты
    // Хотелось бы сделать фиксированной длинны, чтобы
    // в конце, когда берем data[0] там был результат именно первой
    // функции, даже не смотря на то, что вторая могла закончиться
    // быстрее
    // Но так как параметры callback заданы как
    // необязательный первый параметр data
    // обязательный 2-й - callback
    // но пока не придумал, куда тут индекс еще передать, по которому класть
    // var data = new Array(functionsLength);
    var results = [];
    var index = 0;
    var next = function (error, data) {
        if (error || i === functionsLength - 1) {
            callback(error, results);
        }
        results.push(data);
    };
    for (var i = 0; i < functionsLength; ++i) {
        setTimeout(functions[i](next), 0);
        //functions[i](next);
    }
    //functions.forEach(function (elem, index) {
    //    //setTimeout(elem, 0, next);
    //    elem(next);
    //}, this)
};

module.exports.map = function (values, func, callback) {
    var valuesLength = values.length;
    var results = [];
    var next = function (error, data) {
        if (error || i === valuesLength - 1) {
            callback(error, results);
        }
        results.push(data);
    };
    for (var i = 0; i < valuesLength; ++i) {
        setTimeout(func(values[i], next), 0);
        //func(values[i], next);
    }
    //values.forEach(function (elem, index) {
    //    //setTimeout(func, 0, elem, next);
    //    func(elem, next);
    //}, this)
};
