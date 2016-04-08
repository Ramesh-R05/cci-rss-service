var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require("chai-as-promised");

chai.config.includeStack = true;
chai.use(sinonChai);
chai.use(chaiAsPromised);
global.config = require('config');
global.expect = chai.expect;
global.should = chai.should();
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;
global.sinon = sinon;