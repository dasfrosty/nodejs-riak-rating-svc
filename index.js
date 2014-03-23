/*jslint node: true, sloppy: true, indent: 2 */

var deem = require(__dirname + '/deem.js').createDeem('localhost', 8098);
deem.listen(8080);
