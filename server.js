/*jslint node: true, sloppy: true, indent: 2 */

var restify = require('restify');
var http = require('http');

////////////////////////////
// riak functions
////////////////////////////

function getRiakUserPath(userId) {
  //TODO: check userId is valid id
  return '/buckets/test/keys/' + userId;
};

function getRiakRequestOptions(method, path) {
  var headers = {};
  if (method == 'PUT') {
    headers = {
      'Content-Type': 'application/json'
    };
  };
  return {
    hostname: 'localhost',
    port: 8098,
    path: path,
    method: method,
    headers: headers,
    agent: false
  };
};

function riakGet(path, callback) {
  var options = getRiakRequestOptions('GET', path);
  var req = http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      //FIXME: assume there's one chunk for now
      callback(chunk);
    });
  });

  req.on('error', function(e) {
    //FIXME: handle this case
    console.log('problem with request: ' + e.message);
  });

  req.end();
};

function riakPut(path, obj, callback) {
  var options = getRiakRequestOptions('PUT', path);
  var req = http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      //FIXME: assume there's one chunk for now
      callback(chunk);
    });
  });

  req.on('error', function(e) {
    //FIXME: handle this case
    console.log('problem with request: ' + e.message);
  });

  req.write(JSON.stringify(obj));
  req.end();
};

////////////////////////////
// handler functions
////////////////////////////

function getUser(req, res, next) {
  console.log('getUser() userId = %s', req.params.userId);
  var path = getRiakUserPath(req.params.userId);
  riakGet(path, function (data) {
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
