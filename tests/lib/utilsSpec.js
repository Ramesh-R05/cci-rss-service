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

});
