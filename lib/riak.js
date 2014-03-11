/*jslint node: true, sloppy: true, indent: 2 */

var http = require('http');

var Riak = function (hostname, port) {
  this.hostname = hostname;
  this.port = port;
}

Riak.prototype._getRequestOptions = function (method, path) {
  var headers = {};
  if (method == 'PUT') {
    headers = {
      'Content-Type': 'application/json'
    };
  };
  return {
    hostname: this.hostname,
    port: this.port,
    path: path,
    method: method,
    headers: headers,
    agent: false
  };
};

Riak.prototype._execGet = function (options, callback) {
  console.log('_exectGet(): path = %s', options.path);
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

Riak.prototype.load = function(bucket, key, callback) {
  var path = '/buckets/' + bucket + '/keys/' + key;
  var options = this._getRequestOptions('GET', path);
  this._execGet(options, callback);
};

// function getRiakRequestOptions(hostname, port, method, path) {
//   var headers = {};
//   if (method == 'PUT') {
//     headers = {
//       'Content-Type': 'application/json'
//     };
//   };
//   return {
//     hostname: 'localhost',
//     port: 8098,
//     path: path,
//     method: method,
//     headers: headers,
//     agent: false
//   };
// };

// function riakGet(path, callback) {
//   var options = getRiakRequestOptions('GET', path);
//   var req = http.request(options, function(res) {
//     console.log('STATUS: ' + res.statusCode);
//     console.log('HEADERS: ' + JSON.stringify(res.headers));
//     res.setEncoding('utf8');
//     res.on('data', function (chunk) {
//       //FIXME: assume there's one chunk for now
//       callback(chunk);
//     });
//   });

//   req.on('error', function(e) {
//     //FIXME: handle this case
//     console.log('problem with request: ' + e.message);
//   });

//   req.end();
// };

exports.createRiak = function (hostname, port) {
  return new Riak(hostname, port);
}
