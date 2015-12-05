'use strict';

// Ваша супер библиотека
var flow = require('./lib/flow.js');

// Модуль для работы с файловой системой
var fs = require('fs');

// Директория с файлами
var directory = './cats/';

// Последовательно выполняем операции
flow.serial([
    // Вначале читаем список файлов директории

    // `next` – классический колбэк всегда принимает два аргумента:
    //    - `error` - ошибка
    //    - `data` - результат
    function (next) {
        // Часть методов в Node.js уже умеет принимать такие специальные колбэки
        // Например, чтение списка файлов директории
        fs.readdir(directory, function (error, data) {
            next(error, data);
        });
    },

    // В качестве первого аргумента следующей функции передаётся результат предыдущей функции
    // Этот аргумент не обязательный (смотри первую функцию)
    function (files, next) {
        files = files.map(function (dir) {
            return directory + dir;
        });
        console.log(files);

        // Параллельно получаем параметры файлов и читаем их содержимое
        flow.parallel([
            function (next) {
                // Получаем параметры для каждого файла
                flow.map(files, fs.stat, next);
            },
            function (next) {
                // Читаем содержимое для каждого файла
                flow.map(files, fs.readFile, next);
            }
        ], function (error, data) {
            next(error, data);
        });
    }

// Результат последней функции передаётся в этот колбэк
], function (error, data) {
    // Если в одной из асинхронных операции произошла ошибка – выводим её
    if (error) {
        console.error(error.message);
        return;
    }

    // Собранные параметры по файлам
    var stats = data[0];

    // Прочитанное содержимое файлов
    var contents = data[1];
    console.log(contents);
    contents = contents
        // Исключаем пустые файлы
        .filter(function (content, index) {
            return stats[index].size > 0;
        })
        // Читаем JSON из файлов
        .map(JSON.parse);

    // И выводим
    console.log(contents);
});