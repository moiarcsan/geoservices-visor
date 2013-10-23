var clientRequest = require("./httpclient").request;
var Headers = require("ringo/utils/http").Headers;
var objects = require("ringo/utils/objects");

function getGeoServerUrl(request) {
    var url = java.lang.System.getProperty("app.proxy.geoserver");
    if (url) {
        if (url.charAt(url.length-1) !== "/") {
            url = url + "/";
        }
    } else {
        url = request.scheme + "://" + request.host + (request.port ? ":" + request.port : "") + "/geoserver/";
    }
    return url;
}

function getAdminAppUrl(request) {
    var url = java.lang.System.getProperty("app.proxy.adminApp");
    if (url) {
        if (url.charAt(url.length-1) !== "/") {
            url = url + "/";
        }
    } else {
        var port = request.port ? "8080" : "";
        url = request.scheme + "://" + request.host + (port ? ":" + port : "") + "/sir-ohiggins/"; //TODO: reemplazar
    }
    return url;
}

function getLoginUrl(request) {
    var url = getAdminAppUrl(request) + "j_spring_security_check";
    //console.log(url);
    return url;
    // return getGeoServerUrl(request) + "j_spring_security_check";
}

function getAuthUrl(request) {
    return getGeoServerUrl(request) + "rest";
}

// get status (ACK!) by parsing Location header
function parseStatus(exchange) {
    var status = 200;
    var location = exchange.headers.get("Location");
    if (/error=true/.test(location)) {
        status = 401;
    }
    return status;
}

exports.getStatus = function(request) {
    //var url = getAuthUrl(request);
    var url = getLoginUrl(request);
    console.log("authUrl --> "+url);
    var status = 401;
    var headers = new Headers(request.headers);
    var token = headers.get("Cookie");
    var exchange = clientRequest({
        url: url,
        method: "GET",
        async: false,
        headers: headers
    });
    exchange.wait();
    return exchange.status;
};

exports.authenticate = function(request) {

    var params = request.postParams;
    var status = 401;
    var token;
    var userInfo;
    
    if (params.username && params.password) {
        var url = getLoginUrl(request);
        var exchange = clientRequest({
            url: url,
            method: "post",
            async: false,
            data: {
                j_username: params.username,
                j_password: params.password
            }
        });
        exchange.wait();
        status = parseStatus(exchange);
        if (status === 200) {
            var cookie = exchange.headers.get("Set-Cookie");
            if (cookie) {
                token = cookie.split(";").shift();
                userInfo = this.getUserInfo(request, cookie);
            }
        }
    }
    return {
        token: token,
        status: status,
        userInfo: userInfo
    }
};

/* 
 * User info url
 *
 * @see com.emergya.persistenceGeo.web.RestUserAdminController#getUserInfo()
 */
function getUserInfoUrl(request) {
    var url = getAdminAppUrl(request) + "rest/persistenceGeo/getUserInfo";
    console.log(url);
    return url;
}

exports.getUserInfo = function(request, cookie) {
    var status = 401;
    var token;
    var userInfo;

    
    var url = getUserInfoUrl(request);
    var exchange = clientRequest({
        url: url,
        method: "post",
        headers: {
            "Cookie": cookie + ";Path=/"
        },
        async: false
    });
    exchange.wait();
    status = parseStatus(exchange);
    if (status === 200) {
        userInfo = exchange.content;
    }

    return userInfo;
};
