/*jslint node: true, sloppy: true, indent: 2 */

var restify = require('restify');
var riak = require(__dirname + '/riak.js');

function getUserRatingKey(category, itemId, userId) {
  return category + '-' + itemId + '-' + userId;
};

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
  this.riak.getObject(this.bucket, userId, callback);
};

Deem.prototype.putUserRating = function (category, itemId, userId, rating, callback) {
  var userRating = {
    category: category,
    itemId: itemId,
    userId: userId,
    rating: rating
  };
  var key = getUserRatingKey(category, itemId, userId);
  console.log('putUserRating() userRating = %s, key = %s', JSON.stringify(userRating), key);
  this.riak.putObject(this.bucket, key, userRating, callback);
};

Deem.prototype.getUserRating = function (category, itemId, userId, callback) {
  var key = getUserRatingKey(category, itemId, userId);
  console.log('getUserRating() category = %s, itemId = %s, userId = %s, key = %s', category, itemId, userId, key);
  this.riak.getObject(this.bucket, key, callback);
};

exports.createDeem = function (riakHostname, riakPort, bucket) {
  return new Deem(riak.createRiak(riakHostname, riakPort), bucket);
};
