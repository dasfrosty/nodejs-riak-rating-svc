/*jslint node: true, sloppy: true, indent: 2 */

var restify = require('restify');
var deemjs = require(__dirname + '/deem.js');

var Rest = function (deem) {
  this.deem = deem;
};

Rest.prototype.putUser = function (req, res, next) {
  var deem = this.deem;
  var body = '';
  req.on('data', function (chunk) {
    console.log('got %d bytes of data', chunk.length);
    body += chunk;
  });
  req.on('end', function () {
      console.log('putUser(): body = %s', body);
      var user = JSON.parse(body);
      var userId = user.userId;
      var email = user.email;
      var password = user.password;

      deem.putUser(userId, email, password, function (obj) {
        console.log(obj);
        res.send(obj);
        next();
      });
  });
};

Rest.prototype.getUser = function (req, res, next) {
  var userId = req.params.userId;
  this.deem.getUser(userId, function (obj) {
    console.log('getUser(): %j', obj);
    res.send(obj);
    next();
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

Rest.prototype.getUserRating = function (req, res, next) {
  var userId = req.params.userId;
  var itemType = req.params.itemType;
  var itemId = req.params.itemId;
  this.deem.getUserRating(userId, itemType, itemId, function (obj) {
    console.log(obj);
    res.end(JSON.stringify(obj));
  });
};

Rest.prototype.configure = function () {
  this.server = restify.createServer({name: 'deem'});
  this.server.pre(restify.pre.userAgentConnection());

  // setup routes
  var rest = this;

  this.server.put('/user/:userId', function (req, res, next) {
    rest.putUser(req, res, next);
  });

  this.server.get('/user/:userId', function (req, res, next) {
    rest.getUser(req, res, next);
  });

  this.server.put('/user/:userId/:itemType/:itemId/:rating', function (req, res, next) {
    rest.putUserRating(req, res, next);
  });

  this.server.get('/user/:userId/:itemType/:itemId', function (req, res, next) {
    rest.getUserRating(req, res, next);
  });

  return this;
};

Rest.prototype.listen = function (port) {
  var that = this;
  this.server.listen(port, function () {
    console.log('%s listening at %s -- bucket => \'%s\'', that.server.name, that.server.url, that.deem.bucket);
  });
  return this;
};

exports.createRest = function (riakHostname, riakPort, bucket) {
  var deem = deemjs.createDeem(riakHostname, riakPort, bucket);
  return new Rest(deem).configure();
};
