var stringHelper = require('../../../lib/helpers/stringHelper');

describe('stringHelper', function () {

    describe('split', function () {

        var splitString = 'A|B|C||D';
        var separator = '|';

        describe('when: removeEmpty = true', function () {

            it('should not contain empty elements', function () {

                var actual = stringHelper.split(splitString, separator, true);

                expect(actual.length).to.equal(4);

                var emptyFound = false;
                for(var i = 0; i < actual.length; i++)
                {
                    if(actual[i] === '')
                    {
                        emptyFound = true;
                        break;
                    }
                }

                expect(emptyFound).to.be.false;

            });

        });

        describe('when: removeEmpty = false', function () {

            it('should contain empty elements', function () {

                var actual = stringHelper.split(splitString, separator);

                expect(actual.length).to.equal(5);

                var emptyFound = false;
                for (var i = 0; i < actual.length; i++) {
                    if (actual[i] === '') {
                        emptyFound = true;
                        break;
                    }
                }

                expect(emptyFound).to.be.true;

            });

        });

        describe('when: no separator defined', function () {

            before(function () {
                splitString = splitString.replace(/\|/g, ',');
            });

            after(function () {
                splitString = splitString.replace(/,/g, '|');
            });

            it('should separate on comma', function () {

                var actual = stringHelper.split(splitString);

                expect(actual.length).to.equal(5);

            });
        });

    });

    describe('isEmpty', function () {

        describe('when: test string is undefined', function () {

            it('should return \'true\'', function () {
                expect(stringHelper.isEmpty()).to.be.true;
            });

        });

        describe('when: test string is null', function () {

            it('should return \'true\'', function () {
                expect(stringHelper.isEmpty(null)).to.be.true;
            });
        });

        describe('when: test string is empty string', function () {

            it('should return \'true\'', function () {
                expect(stringHelper.isEmpty('')).to.be.true;
            });
        });

        describe('when: test string is not empty', function () {

            it('should return \'false\'', function () {
                expect(stringHelper.isEmpty('test')).to.be.false;
            });
        });

    });

    describe('parseFunction', function () {

        var fnStrNoParams = 'fnA';
        var fnStrWithParams = 'fnA(x, y)';
        var fnStrWithFunctionParam = 'fnA(x, fnB(y, z))';
        var fnStrWithEscapedParam = 'fnA(x, \\(y\\))';

        describe('when: no parameters', function () {

            it('should have an empty parameter list', function () {

                var actual = stringHelper.parseFunction(fnStrNoParams);

                expect(actual.name).to.equal('fnA');
                expect(actual.params.length).to.equal(0);

            });

        });

        describe('when: parameters exist', function () {

            it('should contain a list of parameters', function () {

                var actual = stringHelper.parseFunction(fnStrWithParams);

                expect(actual.name).to.equal('fnA');
                expect(actual.params.length).to.equal(2);
                expect(actual.params[0]).to.equal('x');
                expect(actual.params[1]).to.equal('y');

            });

        });

        describe('when: function parameters exist', function () {

            it('should have function string as a parameter', function () {

                var actual = stringHelper.parseFunction(fnStrWithFunctionParam);

                expect(actual.name).to.equal('fnA');
                expect(actual.params.length).to.equal(2);
                expect(actual.params[0]).to.equal('x');
                expect(actual.params[1]).to.equal('fnB(y, z)');

            });

        });

        describe('when: parameters exist with escaped cheracters', function () {

            it('should include escaped characters in parameter', function () {

                var actual = stringHelper.parseFunction(fnStrWithEscapedParam);

                expect(actual.name).to.equal('fnA');
                expect(actual.params.length).to.equal(2);
                expect(actual.params[0]).to.equal('x');
                expect(actual.params[1]).to.equal('(y)');

            });

        });

    });

});