/*jslint node: true, sloppy: true, indent: 2 */

var restify = require('restify');
var http = require('http');

////////////////////////////
// configure riak
////////////////////////////

var riak = require('./lib/riak.js').createRiak('localhost', 8098);

////////////////////////////
// handler functions
////////////////////////////

function getUser(req, res, next) {
  console.log('getUser() userId = %s', req.params.userId);
  riak.load('test', req.params.userId, function (data) {
    res.end(data);
  });
};

function putUser(req, res, next) {
  var userId = req.params.userId;
  console.log('putUser() userId = %s', userId);
  var path = getRiakUserPath(userId) + "?returnbody=true";
  var obj = {userId: userId, username: "test", email: "test@example.com"};
  riakPut(path, obj, function (data) {
    res.end(data);
  });
};

function getUserRating(req, res, next) {
  console.log('getUserRating()');
  var rating = {
    userId: req.params.userId,
    itemType: req.params.itemType,
    itemId: req.params.itemId,
    rating: 5
  };
  res.end(rating);
};

function putUserRating(req, res, next) {
  console.log('putUserRating()');
  res.end('OK');
};

////////////////////////////
// configure server
////////////////////////////

var server = restify.createServer({name: 'deem-service'});
server.pre(restify.pre.userAgentConnection());

// setup routes
server.get('/user/:userId', getUser);
server.put('/user/:userId', putUser);
server.get('/user/:userId/:itemType/:itemId', getUserRating);
server.put('/user/:userId/:itemType/:itemId/:rating', putUserRating);

// start listening for connections
server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
