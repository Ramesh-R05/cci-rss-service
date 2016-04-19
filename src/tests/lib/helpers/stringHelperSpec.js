var stringHelper = require('../../../app/helpers/stringHelper');

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

    describe('stripHtml', function () {

        var testInput;
        var expectedResult;

        describe('when: input string contains html and no allowed tags are set', function () {

            before(function () {
                testInput = '<strong>Lorem</strong> ipsum <a href="http://www.example.com">dolor</a>.';
                expectedResult = 'Lorem ipsum dolor.';
            });

            it('should remove all html from the input string', function () {
                expect(stringHelper.stripHtml(testInput)).to.equal(expectedResult);
            });

            describe('and when: allowed tags are set', function () {

                before(function () {
                    expectedResult = 'Lorem ipsum <a href="http://www.example.com">dolor</a>.'
                });

                it('should remove all other html tags from the input string', function () {
                    expect(stringHelper.stripHtml(testInput, ['a'])).to.equal(expectedResult);
                });
            });

        });

    });

    describe('stripMarkdown', function () {

        var testInput;
        var expectedResult;

        describe('when: input string contains markdown', function () {

            before(function () {
                testInput = '**Lorem** ipsum [dolor](http://www.example.com).';
                expectedResult = 'Lorem ipsum dolor.';
            });

            it('should remove all markdown from the input string', function () {
                expect(stringHelper.stripMarkdown(testInput)).to.equal(expectedResult);
            });

        });

    });

});