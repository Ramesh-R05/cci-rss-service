var mimeTypeHelper = require('../../../app/helpers/mimeTypeHelper');

describe('mimeTypeHelper', function () {

    describe('getType', function () {

        var testFilePath = 'http://www.example.com/img/test.jpg';
        var testQuery = '?width=800';
        var expectedMimeType = 'image/jpeg';

        describe('when: file path is empty', function () {

            it('should return an empty string', function () {

                expect(mimeTypeHelper.getType('')).to.equal('');

            });

        });

        describe('when: file path is valid jpeg image', function () {

            it('should return \'' + expectedMimeType + '\'', function () {

                expect(mimeTypeHelper.getType(testFilePath)).to.equal(expectedMimeType);

            });

        });

        describe('when: file path contains query string parameters', function () {

            it('should return \'' + expectedMimeType + '\'', function () {

                var path = testFilePath + testQuery;
                expect(mimeTypeHelper.getType(path)).to.equal(expectedMimeType);

            });

        });

    });

});