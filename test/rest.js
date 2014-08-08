/*jslint node: true, sloppy: true, indent: 2 */

var should = require('should');
var request = require('supertest');

var restjs = require(__dirname + '/../lib/rest.js');

var riakHostname = 'localhost';
var riakPort = 8098;
var riakBucket = 'deem_test_rest';

var restPort = 8081;
var contextPath = '/deem';
var restBaseUrl = 'http://localhost:' + restPort + contextPath;

describe('Deem REST', function () {

  before(function (done) {
    restjs.createRest(riakHostname, riakPort, riakBucket).listen(restPort);
    done();
  });

  describe('User API', function () {

    var expected = {
      userId: 8654,
      email: 'redbaron@snoopy.com',
      password: 'sopwithcamel'
    };

    it('should load a user that gets put', function (done) {
      request(restBaseUrl)
        .put('/user/' + expected.userId)
        .accept('application/json')
        .send(expected)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.body.userId.should.equal(expected.userId);
          res.body.email.should.equal(expected.email);
          res.body.password.should.equal(expected.password);
          request(restBaseUrl)
            .get('/user/' + expected.userId)
            .accept('application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              should.not.exist(err);
              res.body.userId.should.equal(expected.userId);
              res.body.email.should.equal(expected.email);
              res.body.password.should.equal(expected.password);
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

    it('should load a rating that gets put', function (done) {
      request(restBaseUrl)
        .put('/rating/' + expected.category + '/' + expected.itemId + '/user/' + expected.userId)
        .accept('application/json')
        .send(expected)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          res.body.category.should.equal(expected.category);
          res.body.itemId.should.equal(expected.itemId);
          res.body.userId.should.equal(expected.userId);
          res.body.rating.should.equal(expected.rating);
          request(restBaseUrl)
            .get('/rating/' + expected.category + '/' + expected.itemId + '/user/' + expected.userId)
            .accept('application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              should.not.exist(err);
              res.body.category.should.equal(expected.category);
              res.body.itemId.should.equal(expected.itemId);
              res.body.userId.should.equal(expected.userId);
              res.body.rating.should.equal(expected.rating);
              done();
            });
        });
    });

  });

});
