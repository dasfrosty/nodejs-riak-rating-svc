/*jslint node: true, sloppy: true, indent: 2 */

var should = require('should');
var request = require('supertest');

var riakjs = require(__dirname + '/../lib/riak.js');

var riakHostname = 'localhost';
var riakPort = 8098;
var riakBaseUrl = 'http://' + riakHostname + ':' + riakPort;
var riakBucket = 'deem_test_riak';


////////////////////////////
// riak server tests
////////////////////////////

describe('riak server', function () {

  it('should return an object that gets put', function (done) {
    var obj = {id: 7654, foo: 'bar'};
    var path = '/buckets/' + riakBucket + '/keys/' + obj.id;
    request(riakBaseUrl)
      .put(path + '?returnbody=true')
      .send(obj)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        should.not.exist(err);
        res.body.id.should.equal(obj.id);
        res.body.foo.should.equal(obj.foo);
        request(riakBaseUrl)
          .get(path)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err, res) {
            should.not.exist(err);
            res.body.id.should.equal(obj.id);
            res.body.foo.should.equal(obj.foo);
            done();
          });
      });
  });

  it('should list buckets', function (done) {
    request(riakBaseUrl)
      .get('/buckets/?buckets=true')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        should.not.exist(err);
        should(res.body.buckets.length).greaterThan(0);
        done();
      });
  });

});


////////////////////////////
// riak module tests
////////////////////////////

describe('riak module', function () {

  var riak = riakjs.createRiak(riakHostname, riakPort);

  it('should return null for a key that does not exist', function (done) {
    riak.getObject(riakBucket, 95846474836363, function (err, returnObj) {
      should.not.exist(err);
      should.not.exist(returnObj);
      done();
    });
  });

  it('should load an object that gets put', function (done) {
    var obj = {id: 7654, foo: 'bar'};
    riak.putObject(riakBucket, obj.id, obj, function (err, returnObj) {
      should.not.exist(err);
      should.exist(returnObj);
      returnObj.id.should.equal(obj.id);
      returnObj.foo.should.equal(obj.foo);
      riak.getObject(riakBucket, obj.id, function (err, returnObj) {
        should.not.exist(err);
        should.exist(returnObj);
        returnObj.id.should.equal(obj.id);
        returnObj.foo.should.equal(obj.foo);
        done();
      });
    });
  });

  it('should update an object that gets put', function (done) {
    var obj = {id: 7654, foo: 'foobar'};
    riak.putObject(riakBucket, obj.id, obj, function (err, returnObj) {
      should.not.exist(err);
      should.exist(returnObj);
      returnObj.id.should.equal(obj.id);
      returnObj.foo.should.equal(obj.foo);
      riak.getObject(riakBucket, obj.id, function (err, returnObj) {
        should.not.exist(err);
        should.exist(returnObj);        
        returnObj.id.should.equal(obj.id);
        returnObj.foo.should.equal(obj.foo);
        done();
      });
    });
  });

});
