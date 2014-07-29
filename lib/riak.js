/*jslint node: true, sloppy: true, indent: 2 */

var http = require('http');

var Riak = function (hostname, port) {
  this.hostname = hostname;
  this.port = port;
}

Riak.prototype._getRequestOptions = function (method, path) {
  var headers = {
    'Accept': 'application/json',
  };
  if (method == 'PUT') {
    headers['Content-Type'] = 'application/json; charset=UTF-8';
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
      if (res.statusCode == 200 || res.statusCode == 404)
        callback(null, res.statusCode, body);
      else
        callback(Error('Unexpected HTTP status code from GET: ' + res.statusCode), res.statusCode, body);
    });
  });

  req.on('error', function(err) {
    console.log('problem with request: ' + err.message);
    callback(err);
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
      if (res.statusCode == 200)
        callback(null, res.statusCode, body);
      else
        callback(Error('Unexpected HTTP status code from PUT: ' + res.statusCode), res.statusCode, body);
    });
  });

  req.on('error', function(err) {
    console.log('problem with request: ' + err.message);
    callback(err);
  });

  req.write(data);
  req.end();
};

Riak.prototype.getObject = function(bucket, key, callback) {
  var path = '/buckets/' + bucket + '/keys/' + key;
  var options = this._getRequestOptions('GET', path);
  this._execGet(options, function (err, statusCode, body) {
    if (err)
      return callback(err);
    var obj = null;
    if (statusCode == 200) {
      obj = JSON.parse(body.toString('utf8'));
    }
    return callback(null, obj);
  });
};

Riak.prototype.putObject = function(bucket, key, obj, callback) {
  var path = '/buckets/' + bucket + '/keys/' + key + '?returnbody=true';
  var options = this._getRequestOptions('PUT', path);
  var data = JSON.stringify(obj);
  this._execPut(options, data, function (err, statusCode, body) {
    if (err)
      return callback(err);
    var obj = null;
    if (statusCode == 200) {
      obj = JSON.parse(body.toString('utf8'));
    }
    callback(null, obj);
  });
};

exports.createRiak = function (hostname, port) {
  return new Riak(hostname, port);
}
