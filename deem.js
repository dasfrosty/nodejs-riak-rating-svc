/*jslint node: true, sloppy: true, indent: 2 */

var restify = require('restify');
var riak = require(__dirname + '/lib/riak.js');

var Deem = function (riak) {
  this.riak = riak;
}

////////////////////////////
// handler functions
////////////////////////////

Deem.prototype._getUser = function (req, res, next) {
  var userId = req.params.userId;
  console.log('getUser() userId = %s', userId);
  console.log(this.riak);
  this.riak.loadObject('test', userId, function (obj) {
    console.log(obj);
    res.end(JSON.stringify(obj));
  });
};

Deem.prototype._putUser = function (req, res, next) {
  var userId = req.params.userId;
  var username = 'dastesty';
  var email = 'dastesty@example.com';
  var user = {userId: userId, username: username, email: email};
  console.log('putUser() user = %s', JSON.stringify(user));
  this.riak.putObject('test', userId, user, function (obj) {
    console.log(obj);
    res.end(JSON.stringify(obj));
  });
};

Deem.prototype._getUserRating = function (req, res, next) {
  console.log('getUserRating()');
  var rating = {
    userId: req.params.userId,
    itemType: req.params.itemType,
    itemId: req.params.itemId,
    rating: 5
  };
  res.end(rating);
};

Deem.prototype._putUserRating = function (req, res, next) {
  console.log('putUserRating()');
  res.end('OK');
};

Deem.prototype._configure = function () {
  this.server = restify.createServer({name: 'deem'});
  this.server.pre(restify.pre.userAgentConnection());

  // setup routes

  this.server.get('/user/:userId', function (deem) {
    return function (req, res, next) {
      deem._getUser(req, res, next);
    }
  }(this));

  this.server.put('/user/:userId', function (deem) {
    return function (req, res, next) {
      deem._putUser(req, res, next);
    }
  }(this));

  this.server.get('/user/:userId/:itemType/:itemId', function (deem) {
    return function (req, res, next) {
      deem._getUserRating(req, res, next);
    }
  }(this));

  this.server.put('/user/:userId/:itemType/:itemId/:rating', function (deem) {
    return function (req, res, next) {
      deem._putUserRating(req, res, next);
    }
  }(this));

  return this;
};

Deem.prototype.listen = function (port) {
  console.log(this.riak);
  var that = this;
  this.server.listen(port, function () {
    console.log('%s listening at %s -- %s', that.server.name, that.server.url, that.riak);
  });
  return this;
};

exports.createDeem = function (riakHostname, riakPort) {
  return new Deem(riak.createRiak(riakHostname, riakPort))._configure();
}
