/*jslint node: true, sloppy: true, indent: 2 */

var restify = require('restify');
var riak = require(__dirname + '/riak.js');

var Deem = function (riak, bucket) {
  this.riak = riak;
  this.bucket = bucket;
};

Deem.prototype.putUser = function (userId, email, password, callback) {
  var user = {
    userId: userId,
    email: email,
    password: password
  };
  console.log('putUser() user = %s', JSON.stringify(user));
  this.riak.putObject(this.bucket, userId, user, callback);
};

Deem.prototype.getUser = function (userId, callback) {
  console.log('getUser() userId = %s', userId);
  this.riak.loadObject(this.bucket, userId, callback);
};

Deem.prototype.putUserRating = function (userId, itemType, itemId, rating, callback) {
  var userRating = {
    userId: userId,
    itemType: itemType,
    itemId: itemId,
    rating: rating
  };
  var key = userId + '-' + itemType + '-' + itemId;
  console.log('putUserRating() userRating = %s, key = %s', JSON.stringify(userRating), key);
  this.riak.putObject(this.bucket, key, userRating, callback);
};

Deem.prototype.getUserRating = function (userId, itemType, itemId, callback) {
  var key = userId + '-' + itemType + '-' + itemId;
  console.log('getUserRating() userId = %s, itemType = %s, itemId = %s, key = %s', userId, itemType, itemId, key);
  this.riak.loadObject(this.bucket, key, callback);
};

exports.createDeem = function (riakHostname, riakPort, bucket) {
  return new Deem(riak.createRiak(riakHostname, riakPort), bucket);
};
