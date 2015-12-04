var fs = require('fs');

var test = require('../lib/flow');

var chai = require('chai');
var sinon = require('sinon');
chai.use(require('sinon-chai'));

var expect = chai.expect;

describe('Котофайлы', () => {
    describe('serial', () => {

        it('Должен вызывать коллбэк, если список функций пуст', () => {
            var callback = sinon.spy();

            test.serial([], callback);
            expect(callback).to.have.been.calledOnce;
            expect(callback).to.have.been.calledWith(null);
        });

        it('Должен вызывать единственную функцию без аргументов', () => {
            var func = sinon.spy((next) => {
                next(null, 1);
            });
            var callback = sinon.spy();

            test.serial([func], callback);
            expect(func).to.have.been.calledOnce;
            expect(callback).to.have.been.calledOnce;
            expect(callback).to.have.been.calledWith(null, 1);
        });

        it('Должен объединять две функции в цепочку', () => {
            var func1 = sinon.spy((next) => {
                next(null, 1);
            });
            var func2 = sinon.spy((data, next) => {
                next(null, 2);
            });
            var callback = sinon.spy();

            test.serial([func1, func2], callback);

            expect(func1).to.have.been.calledOnce;
            expect(func2).to.have.been.calledOnce;
            expect(callback).to.have.been.calledOnce;
            expect(callback).to.have.been.calledWith(null, 2);
            expect(func2.getCall(0).args[0]).to.be.equal(1);
        });

        it('Не выполняется вторая функция, если первая вызвала ошибку', () => {
            var func1 = sinon.spy((next) => {
                next('error');
            });
            var func2 = sinon.spy((data, next) => {
                next(null, 2);
            });
            var callback = sinon.spy();

            test.serial([func1, func2], callback);

            expect(func1).to.be.calledOnce;
            expect(func2).to.not.be.called;
            expect(callback).to.be.calledOnce;
            expect(callback).to.be.calledWith('error');
        });

    });

    describe('parallel', () => {

        it('Должен вызывать коллбэк, если список функций пуст', () => {
            var callback = sinon.spy();

            test.parallel([], callback);
            expect(callback).to.have.been.calledOnce;
            expect(callback).to.have.been.calledWith(null, []);
        });

        it('Должен вызывать единственную функцию', () => {
            var func = sinon.spy((next) => {
                next(null, 1);
            });
            var callback = sinon.spy();

            test.parallel([func], callback);

            expect(func).to.be.calledOnce;
            expect(callback).to.be.calledOnce;
            expect(callback).to.be.calledWith(null, [1]);
        });

        it('Должен вызывать все три функции', () => {
            var func1 = sinon.spy((next) => {
                next(null, 1);
            });
            var func2 = sinon.spy((next) => {
                next(null, 2);
            });
            var func3 = sinon.spy((next) => {
                next(null, 3);
            });
            var callback = sinon.spy();

            test.parallel([func1, func2, func3], callback);

            expect(func1).to.be.calledOnce;
            expect(func2).to.be.calledOnce;
            expect(func3).to.be.calledOnce;
            expect(callback).to.be.calledOnce;
            expect(callback).to.be.calledWith(null, [1, 2, 3]);
        });

        it('Должен параллельно вызывать все три функции, если limit > 3', () => {
            var func1 = sinon.spy((next) => {
                next(null, 1);
            });
            var func2 = sinon.spy((next) => {
                next(null, 2);
            });
            var func3 = sinon.spy((next) => {
                next(null, 3);
            });
            var callback = sinon.spy();

            test.parallel([func1, func2, func3], 5, callback);

            expect(func1).to.be.calledOnce;
            expect(func2).to.be.calledOnce;
            expect(func3).to.be.calledOnce;
            expect(callback).to.be.calledOnce;
            expect(callback).to.be.calledWith(null, [1, 2, 3]);
        });

        it('Должен вызывать все три функции по порядку, т.к. задано ограничение в 1',
            (done) => {

                var func1 = sinon.spy((next) => {
                    fs.readFile('./cats/barsik.json', () => {
                        sinon.assert.notCalled(func2);
                        sinon.assert.notCalled(func3);
                        next(arguments);
                    });
                });
                var func2 = sinon.spy((next) => {
                    fs.readFile('./cats/batonchik.json', () => {
                        sinon.assert.calledOnce(func1);
                        sinon.assert.notCalled(func3);
                        next(arguments);
                    });
                });
                var func3 = sinon.spy((next) => {
                    fs.readFile('./cats/murzic.json', () => {
                        sinon.assert.calledOnce(func1);
                        sinon.assert.calledOnce(func2);
                        next(arguments);
                    });
                });

                var callback = sinon.spy(() => {
                    done();
                });

                test.parallel([func1, func2, func3], 1, callback);
            });

        it('Должен возвращать ошибку, если одна из функций вернула ошибку', () => {
            var func1 = sinon.spy((next) => {
                next(null, 1);
            });
            var func2 = sinon.spy((next) => {
                next('error');
            });
            var func3 = sinon.spy((next) => {
                next(null, 3);
            });
            var callback = sinon.spy();

            test.parallel([func1, func2, func3], callback);

            expect(func1).to.be.calledOnce;
            expect(func2).to.be.calledOnce;
            expect(func3).to.be.calledOnce;
            expect(callback).to.be.calledOnce;
            expect(callback).to.be.calledWith('error', [1, undefined, 3]);
        });

    });
    describe('map', () => {

        it('Должен вызывать коллбэк, если список элементов пуст', () => {

            var func = () => {
            };
            var callback = sinon.spy();

            test.map([], func, callback);
            expect(callback).to.have.been.calledOnce;
            expect(callback).to.have.been.calledWith(null, []);
        });


        it('Должен применять функцию к массиву значений', () => {
            var func = sinon.spy((value, next) => {
                next(null, value * 2);
            });
            var callback = sinon.spy();

            test.map([1, 2, 3], func, callback);

            expect(func).to.be.calledThrice;
            expect(callback).to.be.calledOnce;
            expect(callback).to.be.calledWith(null, [2, 4, 6]);
        });

    });
    describe('makeAsync', () => {

        it('Полученную функцию можно использовать в serial', (done) => {

            var callback = (error, data) => {
                expect(error).to.be.equal(null);
                expect(data.name).to.be.equal('barsik');
                expect(data.price).to.be.equal(5000);
                done();
            };
            test.serial([
                (next) => {
                    fs.readFile('./cats/barsik.json', next);
                },
                test.makeAsync(JSON.parse)
            ], callback);
        });

        it('Если функция выбрасывает исключение, то оно передаётся в качестве ошибки', (done) => {

            var e = new Error('Ошибка!');

            var callback = (error, data) => {
                expect(error).to.be.equal(e);
                expect(data).to.be.equal(undefined);
                done();
            };

            var func = sinon.spy(() => {
                throw e;
            });

            test.serial([test.makeAsync(func)], callback);
        });

        it('Полученную функцию можно использовать в serial первой', (done) => {

            var callback = (error, data) => {
                expect(error).to.be.equal(null);
                expect(data).to.be.equal(10);
                done();
            };

            var func1 = sinon.spy(() => {
                return 5;
            });
            var func2 = sinon.spy((a, next) => {
                next(null, a * 2);
            });

            test.serial([test.makeAsync(func1), func2], callback);
        });

    });
});
