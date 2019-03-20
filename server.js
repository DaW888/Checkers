var http = require("http");
var fs = require("fs");
var qs = require("querystring");

var server = http.createServer(function(req, res) {
    console.log("adres url: " + req.url);
    console.log(req.method);

    switch (req.method) {
        case "GET":
            let adres = req.url;
            adres = adres.split(".");
            let extension = adres[adres.length - 1];
            const staticDir = "static";
            console.log(extension);

            if (req.url === "/libs/jquery-3.3.1.min.js") {
                fs.readFile('.'+req.url, function(_error, data) {
                    res.writeHead(200, {
                        "Content-Type": "application/javascript"
                    });
                    res.write(data);
                    res.end();
                });
            }
            if (req.url === "/libs/three.js") {
                fs.readFile('.'+req.url, function(_error, data) {
                    res.writeHead(200, {
                        "Content-Type": "application/javascript"
                    });
                    res.write(data);
                    res.end();
                });
            }

            if (extension == "/") {
                fs.readFile(staticDir + "/index.html", function(_error, data) {
                    res.writeHead(200, {
                        "Content-Type": "text/html;charset=utf-8"
                    });
                    res.write(data);
                    res.end();
                });
            } else if (extension == "js" && req.url.search("jquery") < 0 && req.url.search("three") < 0) {
                fs.readFile(staticDir + req.url, function(_error, data) {
                    res.writeHead(200, {
                        "Content-Type": "application/javascript"
                    });
                    res.write(data);
                    res.end();
                });
            } else if (extension == "css") {
                fs.readFile(staticDir + req.url, function(_error, data) {
                    res.writeHead(200, { "Content-Type": "text/css" });
                    res.write(data);
                    res.end();
                });
            } else if (extension == "jpg") {
                fs.readFile(__dirname + req.url, function(_error, data) {
                    res.writeHead(200, { "Content-Type": "image/jpeg" });
                    res.write(data);
                    res.end();
                });
            } else if (extension == "png") {
                fs.readFile(__dirname + decodeURI(req.url), function(
                    _error,
                    data
                ) {
                    res.writeHead(200, { "Content-Type": "image/png" });
                    res.write(data);
                    res.end();
                });
            }

            break;

        case "POST":
            servResponse(req, res);
            break;
    }
});

server.listen(3000, function() {
    console.log("server on port: 3000");
});

function servResponse(req, res) {
    var allData = "";

    req.on("data", function(data) {
        console.log("data: " + data);
        allData += data;
    });

    req.on("end", function(data) {
        var finishObj = qs.parse(allData);

        switch (finishObj.akcja) {
            //dodanie nowego usera
            case "addUser":
                dodajUseraDoTablicy();
                break;
            //inna akcja
            case "INNA_AKCJA":
                innaAkcjaNpUsunUserow();
                break;
        }
    });
}
