var server = require("./server");
var router = require("./functionRouter");

server.start(router.route);