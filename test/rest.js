/*jslint node: true, sloppy: true, indent: 2 */

var should = require('should');
var request = require('supertest');

var restjs = require(__dirname + '/../lib/rest.js');

var riakHostname = 'localhost';
var riakPort = 8098;
var riakBucket = 'deem_test_rest';

var restPort = 8081;
var restBaseUrl = 'http://localhost:' + restPort;

describe('Deem REST API', function () {

  before(function (done) {
    restjs.createRest(riakHostname, riakPort, riakBucket).listen(restPort);
    done();
  });

  it('should load a user that gets put', function (done) {
    var expected = {userId: 8654, email: 'redbaron@snoopy.com', password: 'sopwithcamel'};
    request(restBaseUrl)
      .put('/user/' + expected.userId)
      .send(expected)
      // .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        //res.body.userId.should.equal(expected.userId);
        console.log(res.body);
        done();
      });
  });

});


