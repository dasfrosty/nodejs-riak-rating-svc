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
  console.log('_execGet(): path = %s', options.path);
  var req = http.request(options, function(res) {
    var body = '';
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('got %d bytes of data', chunk.length);
      body += chunk;
    });
    res.on('end', function () {
      callback(res.statusCode, body);
    });
  });

  req.on('error', function(e) {
    //FIXME: handle error case
    console.log('problem with request: ' + e.message);
  });

  req.end();
};

Riak.prototype._execPut = function (options, data, callback) {
  console.log('_execPut(): path = %s, data = %s', options.path, data);
  var req = http.request(options, function(res) {
    var body = '';
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('got %d bytes of data', chunk.length);
      body += chunk;
    });
    res.on('end', function () {
      callback(res.statusCode, body);
    });
  });

  req.on('error', function(e) {
    //FIXME: handle error case
    console.log('problem with request: ' + e.message);
  });

  req.write(data);
  req.end();
};

Riak.prototype.loadObject = function(bucket, key, callback) {
  var path = '/buckets/' + bucket + '/keys/' + key;
  var options = this._getRequestOptions('GET', path);
  this._execGet(options, function (status, data) {
    var obj = null;
    if (status == 200) {
      obj = JSON.parse(data.toString('utf8'));
    }
    callback(obj);
  });
};

Riak.prototype.putObject = function(bucket, key, obj, callback) {
  var path = '/buckets/' + bucket + '/keys/' + key + '?returnbody=true';
  var options = this._getRequestOptions('PUT', path);
  var data = JSON.stringify(obj);
  this._execPut(options, data, function (status, data) {
    var obj = null;
    if (status == 200) {
      obj = JSON.parse(data.toString('utf8'));
    }
    callback(obj);
  });
};

exports.createRiak = function (hostname, port) {
  return new Riak(hostname, port);
}
