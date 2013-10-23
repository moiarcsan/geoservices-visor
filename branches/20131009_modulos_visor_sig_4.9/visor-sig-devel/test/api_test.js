var assert = require("assert");
var fs = require("fs");
//var proxy = require("../../../app/root");
//var Headers = require("ringo/utils/http").Headers;

exports["test: all"] = function() {

};

// start the test runner if we're called directly from command line
if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
