/*jslint node: true, sloppy: true, indent: 2 */

var should = require('should');

var deemjs = require(__dirname + '/../lib/deem.js');

var riakHostname = 'localhost';
var riakPort = 8098;
var riakBucket = 'deem_test_deem';


describe('Deem API', function () {

  var deem = deemjs.createDeem(riakHostname, riakPort, riakBucket);

  it('should return null for a user that does not exist', function (done) {
    deem.getUser(95846474836363, function (actual) {
      should.not.exist(actual);
      done();
    });
  });

  it('should load a user that gets put', function (done) {
    var expected = {userId: 8654, email: 'redbaron@snoopy.com', password: 'sopwithcamel'};
    deem.putUser(expected.userId, expected.email, expected.password, function (actual) {
      actual.userId.should.equal(expected.userId);
      actual.email.should.equal(expected.email);
      actual.password.should.equal(expected.password);
      deem.getUser(expected.userId, function (actual) {
        actual.userId.should.equal(expected.userId);
        actual.email.should.equal(expected.email);
        actual.password.should.equal(expected.password);
        done();
      });
    });
  });

  it('should update a user that gets put', function (done) {
    var expected = {userId: 8654, email: 'snoopy@redbaron.com', password: '3plane'};
    deem.putUser(expected.userId, expected.email, expected.password, function (actual) {
      actual.userId.should.equal(expected.userId);
      actual.email.should.equal(expected.email);
      actual.password.should.equal(expected.password);
      deem.getUser(expected.userId, function (actual) {
        actual.userId.should.equal(expected.userId);
        actual.email.should.equal(expected.email);
        actual.password.should.equal(expected.password);
        done();
      });
    });
  });

});


