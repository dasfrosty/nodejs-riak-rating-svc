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
  var userId = req.params.userId;
  console.log('getUser() userId = %s', userId);
  riak.loadObject('test', userId, function (obj) {
    console.log(obj);
    res.end(JSON.stringify(obj));
  });
};

function putUser(req, res, next) {
  var userId = req.params.userId;
  var username = 'dastesty';
  var email = 'dastesty@example.com';
  var user = {userId: userId, username: username, email: email};
  console.log('putUser() user = %s', JSON.stringify(user));
  riak.putObject('test', userId, user, function (obj) {
    console.log(obj);
    res.end(JSON.stringify(obj));
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
server.get('/user/put/:userId', putUser); // mimic PUT through browser
server.put('/user/:userId', putUser);
server.get('/user/:userId/:itemType/:itemId', getUserRating);
server.put('/user/:userId/:itemType/:itemId/:rating', putUserRating);

// start listening for connections
server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
