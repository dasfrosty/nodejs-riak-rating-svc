/*jslint node: true, sloppy: true, indent: 2 */

var restify = require('restify');
var deemjs = require(__dirname + '/deem.js');

var Rest = function (deem) {
  this.deem = deem;
};

Rest.prototype.getUser = function (req, res, next) {
  var userId = req.params.userId;
  this.deem.getUser(userId, function (obj) {
    console.log(obj);
    res.end(JSON.stringify(obj));
  });
};

Rest.prototype.putUser = function (req, res, next) {
  var userId = req.params.userId;
  var email = 'dastesty@example.com';
  var password = 'daspassword';
  this.deem.putUser(userId, email, password, function (obj) {
    console.log(obj);
    res.end(JSON.stringify(obj));
  });
};

Rest.prototype.getUserRating = function (req, res, next) {
  var userId = req.params.userId;
  var itemType = req.params.itemType;
  var itemId = req.params.itemId;
  this.deem.getUserRating(userId, itemType, itemId, function (obj) {
    console.log(obj);
    res.end(JSON.stringify(obj));
  });
};

Rest.prototype.putUserRating = function (req, res, next) {
  var userId = req.params.userId;
  var itemType = req.params.itemType;
  var itemId = req.params.itemId;
  var rating = req.params.rating;
  this.deem.putUserRating(userId, itemType, itemId, rating, function (obj) {
    console.log(obj);
    res.end(JSON.stringify(obj));
  });
};

Rest.prototype.configure = function () {
  this.server = restify.createServer({name: 'deem'});
  this.server.pre(restify.pre.userAgentConnection());

  // setup routes

  this.server.get('/user/:userId', function (rest) {
    return function (req, res, next) {
      rest.getUser(req, res, next);
    }
  }(this));

  this.server.put('/user/:userId', function (rest) {
    return function (req, res, next) {
      rest.putUser(req, res, next);
    }
  }(this));

  this.server.get('/user/:userId/:itemType/:itemId', function (rest) {
    return function (req, res, next) {
      rest.getUserRating(req, res, next);
    }
  }(this));

  this.server.put('/user/:userId/:itemType/:itemId/:rating', function (rest) {
    return function (req, res, next) {
      rest.putUserRating(req, res, next);
    }
  }(this));

  return this;
};

Rest.prototype.listen = function (port) {
  var that = this;
  this.server.listen(port, function () {
    console.log('%s listening at %s -- %s', that.server.name, that.server.url, that.riak);
  });
  return this;
};

exports.createRest = function (riakHostname, riakPort, bucket) {
  var deem = deemjs.createDeem(riakHostname, riakPort, bucket);
  return new Rest(deem).configure();
};
