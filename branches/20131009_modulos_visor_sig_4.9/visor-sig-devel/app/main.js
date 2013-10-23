var {Application} = require("stick");

var app = Application();
app.configure("notfound", "error", "static", "params", "mount");
app.static(module.resolve("static"));

app.mount("/", function(request) {
    if (request.pathInfo.length > 1) {
        throw {notfound: true};
    }
    var target = request.scheme + "://" + request.host + ":" + request.port + request.scriptName + "/Visor/";
    return {
        status: 303,
        headers: {"Location": target},
        body: []
    };
});

// debug mode loads unminified scripts
// assumes markup pulls in scripts under the path /servlet_name/script/
if (java.lang.System.getProperty("app.debug")) {
    var fs = require("fs");
    var config = fs.normal(fs.join(module.directory, "../", "buildjs.cfg"));
    app.mount("/scripts/", require("./autoloader").App(config));
}

//app.mount("/composer", require("./root/composer").app);
if (java.lang.System.getProperty("app.debug")) {
    app.mount("/Visor", require("./root/testAPI.js").app);
    app.mount("/Visor/sicecatII_map.html", require("./root/sicecatII_map.js").app);
    app.mount("/Visor/sicecat.jsp", require("./root/sicecat.js").app);
    app.mount("/Visor/visorGIS.jsp", require("./root/visorGIS.js").app);
    app.mount("/Visor/visorGISLibrary.jsp", require("./root/visorGISLibrary.js").app);
}else{
    app.mount("/", require("./root/sicecatII_map.js").app);
}
//app.mount("/login", require("./root/login").app);
//app.mount("/maps/", require("./root/maps").app);
app.mount("/proxy", require("./root/proxy").app);
// TODO: remove workaround for added slashes
//app.mount("/viewer/proxy", require("./root/proxy").app);
//app.mount("/composer/proxy", require("./root/proxy").app);
//app.mount("/viewer", require("./root/viewer").app);

// mountAndGetRestUrl();

// Redirect requests for servlet name without a trailing slash.
// Jetty does this automatically for /servlet_name, Tomcat does not.
function slash(app) {
    return function(request) {
        var servletRequest = request.env.servletRequest;
        var pathInfo = servletRequest.getPathInfo();
        if (pathInfo === "/") {
            var uri = servletRequest.getRequestURI();
            if (uri.charAt(uri.length-1) !== "/") {
                var location = servletRequest.getScheme() + "://" + 
                    servletRequest.getServerName() + ":" + servletRequest.getServerPort() + 
                    uri + "/";
                return {
                    status: 301,
                    headers: {"Location": location},
                    body: []
                };
            }
        }
        return app(request);
    };
}

function mountAndGetRestUrl(){
    var adminAppRest = java.lang.System.getProperty("app.proxy.adminApp.rest");
    if (adminApp) {
        if (adminAppRest.charAt(adminAppRest.length-1) !== "/") {
            adminAppRest = adminAppRest + "/";
        }
        // debug specific proxy
        app.mount("/adminAppRest/", require("./root/proxy").pass({url: adminAppRest, preserveHost: true, allowAuth: true}));
    }
    return "/proxy/?url=" + adminAppRest;
}

exports.app = slash(app);

// main script to start application
if (require.main === module) {
    require("ringo/httpserver").main(module.id);
}
