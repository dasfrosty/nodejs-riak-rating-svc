/*jslint node: true, sloppy: true, indent: 2 */

var should = require('should');

var deemjs = require(__dirname + '/../lib/deem.js');

var riakHostname = 'localhost';
var riakPort = 8098;
var riakBucket = 'deem_test_deem';


describe('Deem', function () {

  var deem = deemjs.createDeem(riakHostname, riakPort, riakBucket);

  describe('User API', function () {

    var expected = {
      userId: 8654,
      email: 'redbaron@snoopy.com',
      password: 'sopwithcamel'
    };

    it('should return null for a user that does not exist', function (done) {
      deem.getUser(95846474836363, function (err, actual) {
        should.not.exist(err);
        should.not.exist(actual);
        done();
      });
    });

    it('should load a user that gets put', function (done) {
      deem.putUser(expected.userId, expected.email, expected.password, function (err, actual) {
        should.not.exist(err);
        should.exist(actual);
        actual.userId.should.equal(expected.userId);
        actual.email.should.equal(expected.email);
        actual.password.should.equal(expected.password);
        deem.getUser(expected.userId, function (err, actual) {
          should.not.exist(err);
          should.exist(actual);
          actual.userId.should.equal(expected.userId);
          actual.email.should.equal(expected.email);
          actual.password.should.equal(expected.password);
          done();
        });
      });
    });

    it('should update a user that gets put', function (done) {
      var newPassword = '3plane';
      deem.putUser(expected.userId, expected.email, newPassword, function (err, actual) {
        should.not.exist(err);
        should.exist(actual);
        actual.userId.should.equal(expected.userId);
        actual.email.should.equal(expected.email);
        actual.password.should.equal(newPassword);
        deem.getUser(expected.userId, function (err, actual) {
          should.not.exist(err);
          should.exist(actual);
          actual.userId.should.equal(expected.userId);
          actual.email.should.equal(expected.email);
          actual.password.should.equal(newPassword);
          done();
        });
      });
    });

  });

  describe('Rating API', function () {

    var expected = {
      category: 'stuff',
      itemId: 7432,
      userId: 8654,
      rating: 4
    };

    it('should return null for a rating that does not exist', function (done) {
      deem.getUserRating(expected.category, expected.itemId, 95846474836363, function (actual) {
        should.not.exist(actual);
        done();
      });
    });

    it('should load a rating that gets put', function (done) {
      deem.putUserRating(expected.category, expected.itemId, expected.userId, expected.rating, function (err, actual) {
        actual.category.should.equal(expected.category);
        actual.itemId.should.equal(expected.itemId);
        actual.userId.should.equal(expected.userId);
        actual.rating.should.equal(expected.rating);
        deem.getUserRating(expected.category, expected.itemId, expected.userId, function (err, actual) {
          actual.category.should.equal(expected.category);
          actual.itemId.should.equal(expected.itemId);
          actual.userId.should.equal(expected.userId);
          actual.rating.should.equal(expected.rating);
          done();
        });
      });
    });

    it('should update a rating that gets put', function (done) {
      var newRating = expected.rating + 1;
      deem.putUserRating(expected.category, expected.itemId, expected.userId, newRating, function (err, actual) {
        actual.category.should.equal(expected.category);
        actual.itemId.should.equal(expected.itemId);
        actual.userId.should.equal(expected.userId);
        actual.rating.should.equal(newRating);
        deem.getUserRating(expected.category, expected.itemId, expected.userId, function (err, actual) {
          actual.category.should.equal(expected.category);
          actual.itemId.should.equal(expected.itemId);
          actual.userId.should.equal(expected.userId);
          actual.rating.should.equal(newRating);
          done();
        });
      });
    });

  });

});


