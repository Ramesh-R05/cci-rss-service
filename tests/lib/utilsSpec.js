var utils = require('../../lib/utils');

describe('utils', function () {

    describe('getProperty', function () {

        var testObj = {
            a: 1,
            b: {
                x: 2,
                y: 3,
                z: 4
            }
        };

        var testPropName = 'b.y';
        var testDefaultValue = 'default';

        describe('when: property \'' + testPropName + '\' exists', function () {

            it('should return the value of \'' + testPropName + '\'', function () {
                expect(utils.getProperty(testPropName, testObj, testDefaultValue)).to.equal(3);
            });

        });

        describe('when: property does not exist', function () {

            it('should return the default value', function () {
                expect(utils.getProperty('b.a', testObj, testDefaultValue)).to.equal(testDefaultValue);
            });

        });


    });

    describe('isFunction', function () {

        describe('when: test object is a function', function () {
            it('should return \'true\'', function () {
                var test = function () { };
                expect(utils.isFunction(test)).to.be.true;
            });
        });

        describe('when: test object is not a function', function () {
            it('should return \'false\'', function () {
                expect(utils.isFunction('test')).to.be.false;
            });
        });

    });

    describe('isFunctionConfig', function () {

        var testObj;

        describe('when: test object is a function config', function () {

            before(function () {
                testObj = {
                    fn: "functionName"
                };
            });

            it('should return \'true\'', function () {
                expect(utils.isFunctionConfig(testObj)).to.be.true;
            });
        });

        describe('when: test object is not a function config', function () {

            before(function () {
                testObj = {
                    fn: [ "functionName" ]
                };
            });

            it('should return \'false\'', function () {
                expect(utils.isFunctionConfig(testObj)).to.be.false;
            });
        });

    });

    describe('isArray', function () {

        var testObj;

        describe('when: test object is an array', function () {

            before(function () {
                testObj = ['test'];
            });

            it('should return \'true\'', function () {
                expect(utils.isArray(testObj)).to.be.true;
            });

        });

        describe('when: test object is not an array', function () {

            before(function () {
                testObj = 'test';
            });

            it('should return \'false\'', function () {
                expect(utils.isArray(testObj)).to.be.false;
            });

        });
    });

    describe('compileFunction', function () {

        var testConfig;
        var testData = {
            a: 'Lorem ipsum dolor sit amet.',
            b: {
                x: '**Quisque et scelerisque dui**',
                y: 'Sed ornare sed dui ut ultrices.'
            },
            c: 'dolor',
            d: 'sit',
            e: 'amet'
        };

        describe('when: valid function configuration set', function () {

            before(function () {
                testConfig = {
                    fn: 'formatString',
                    params: [
                        '(%s)',
                        {
                            fn: 'sanitise',
                            params: [
                                "{{b.x}}"
                            ]
                        }
                    ]
                };
            });

            it('should successfully compile the function', function () {
                var actual = utils.compileFunction(testConfig, testData);
                expect(actual.func).to.exist.and.not.be.empty;
                expect(actual.scope).to.exist.and.not.be.empty;
                expect(actual.params.length).to.equal(2);
                expect(actual.execute()).to.equal('(Quisque et scelerisque dui)');
            });

            describe('and when: function scope is set', function () {
                
                before(function () {

                    utils.functions.testScope1 = {
                        concat: function (str, arr, obj) {
                            return 'Bad result!'
                        }
                    };

                    utils.functions.testScope2 = {
                        concat: function (str, arr, obj) {
                            var res = [str];
                            for (var i in arr) {
                                if (typeof arr[i] === 'string') {
                                    res.push(arr[i]);
                                }
                            }
                            for(var i in obj){
                                if (typeof obj[i] === 'string') {
                                    res.push(obj[i]);
                                }
                            }
                            return res.join(' ');
                        }
                    };

                    testConfig = {
                        fn: 'concat',
                        scope: 'testScope2',
                        params: [
                            'Lorem',
                            ['ipsum', '{{c}}'],
                            {
                                x: '{{d}}',
                                y: 1,
                                z: 'amet.'
                            }
                        ]
                    }
                });

                after(function () {
                    delete utils.functions.testScope1;
                    delete utils.functions.testScope2;
                });

                it('should compile the function using the correct scope', function () {
                    var actual = utils.compileFunction(testConfig, testData);
                    expect(actual.execute()).to.equal('Lorem ipsum dolor sit amet.');
                });

            });

            describe('and when: no function scope set', function () {

                before(function () {

                    utils.functions.test = function () {
                        return 'Good result!';
                    };

                    testConfig = {
                        fn: 'test'
                    };

                });

                after(function () {
                    delete utils.functions.test;
                });

                it('should find the function scope and sucessfully compile the function', function () {
                    var actual = utils.compileFunction(testConfig, testData);
                    expect(actual.scope).to.exist.and.not.be.empty;
                    expect(actual.execute()).to.equal('Good result!');
                });

            });

            describe('and when: function does not exist', function () {

                before(function () {
                    testConfig = {
                        fn: 'badFunction',
                    }
                });

                it('should return a default compiled function', function () {
                    var actual = utils.compileFunction(testConfig, testData);
                    expect(actual.execute()).to.equal('');
                });

            });

            describe('and when: function name not a function', function () {

                before(function () {
                    utils.functions.test = {
                        count: 100
                    };
                    testConfig = {
                        fn: 'count',
                        scope: 'test'
                    };
                });

                after(function () {
                    delete utils.functions.test;
                });

                it('should return a default compiled function', function () {
                    var actual = utils.compileFunction(testConfig, testData);
                    expect(actual.execute()).to.equal('');
                });

            });

            describe('and when: additional params set', function () {

                before(function () {

                    utils.functions.sum = function (a, b, c, d) {
                        return (a + b + c + d);
                    };

                    testConfig = {
                        fn: 'sum',
                        params: [
                            1,
                            2
                        ]
                    }

                });

                after(function () {
                    delete utils.functions.sum;
                });

                it('should append the additional parameters to the function parameter list', function () {
                    var actual = utils.compileFunction(testConfig, testData, [3, 4]);
                    expect(actual.params.length).to.equal(4);
                    expect(actual.execute()).to.equal(10);
                });

            });

            describe('and when: no binding data set', function () {

                before(function () {

                    utils.functions.test = function (a, b) {
                        return a + ':' + b;
                    };

                    testConfig = {
                        fn: 'test',
                        params: [
                            'x',
                            '{{a}}'
                        ]
                    }

                });

                after(function () {
                    delete utils.functions.test;
                });

                it('should set any bound properties to an empty string', function () {
                    var actual = utils.compileFunction(testConfig);
                    expect(actual.execute()).to.equal('x:');
                });

            });

        });

        describe('when: invalid function configuration set', function () {

            it('should return a default compiled function', function () {
                var actual = utils.compileFunction({}, testData);
                expect(actual.func).to.exist.and.not.be.empty;
                expect(actual.scope).to.exist.and.not.be.empty;
                expect(actual.params).to.be.empty;
                expect(actual.execute()).to.equal('');
            });

        });

    });

});
