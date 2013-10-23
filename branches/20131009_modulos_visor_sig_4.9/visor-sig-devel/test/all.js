exports["test: proxy"] = require("./proxy_test");
exports["test: api"] = require("./api_test");

if (require.main == module || require.main == module.id) {
    system.exit(require("test").run(exports));
}
