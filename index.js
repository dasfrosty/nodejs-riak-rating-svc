/*jslint node: true, sloppy: true, indent: 2 */

var restjs = require(__dirname + '/lib/rest.js');

var riakHostname = 'localhost';
var riakPort = 8098;
var riakBucket = 'deem';
var restPort = 8081;

restjs.createRest(riakHostname, riakPort, riakBucket).listen(restPort);
