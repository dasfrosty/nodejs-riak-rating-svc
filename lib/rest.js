/*jslint node: true, sloppy: true, indent: 2 */

var restify = require('restify');
var deemjs = require(__dirname + '/deem.js');

var Rest = function (deem, contextPath) {
  this.contextPath = contextPath;
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
      var userId = parseInt(req.params.userId);
      var user = JSON.parse(body);
      deem.putUser(userId, user.email, user.password, function (err, obj) {
        if (err) throw err;
        console.log(obj);
        res.send(obj);
        next();
      });
  });
};

Rest.prototype.getUser = function (req, res, next) {
  var userId = req.params.userId;
  this.deem.getUser(userId, function (err, obj) {
    if (err) throw err;
    console.log('getUser(): %j', obj);
    res.send(obj);
    next();
  });
};

Rest.prototype.putUserRating = function (req, res, next) {
  var deem = this.deem;
  var body = '';
  req.on('data', function (chunk) {
    console.log('got %d bytes of data', chunk.length);
    body += chunk;
  });
  req.on('end', function () {
      console.log('putUserRating(): body = %s', body);
      var category = req.params.category;
      var itemId = parseInt(req.params.itemId);
      var userId = parseInt(req.params.userId);
      var rating = JSON.parse(body);
      deem.putUserRating(category, itemId, userId, rating.rating, function (err, obj) {
        if (err) throw err;
        console.log(obj);
        res.send(obj);
        next();
      });
  });
};

Rest.prototype.getUserRating = function (req, res, next) {
  var category = req.params.category;
  var itemId = req.params.itemId;
  var userId = req.params.userId;
  this.deem.getUserRating(category, itemId, userId, function (err, obj) {
    if (err) throw err;
    console.log(obj);
    res.send(obj);
    next();
  });
};

Rest.prototype.configure = function () {
  this.server = restify.createServer({name: 'deem'});
  this.server.pre(restify.pre.userAgentConnection());

  // setup routes
  var rest = this;

  this.server.put(this.contextPath + 'user/:userId', function (req, res, next) {
    rest.putUser(req, res, next);
  });

  this.server.get(this.contextPath + 'user/:userId', function (req, res, next) {
    rest.getUser(req, res, next);
  });

  this.server.put(this.contextPath + 'rating/:category/:itemId/user/:userId', function (req, res, next) {
    rest.putUserRating(req, res, next);
  });

  this.server.get(this.contextPath + 'rating/:category/:itemId/user/:userId', function (req, res, next) {
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
  return new Rest(deem, '/deem/').configure();
};
