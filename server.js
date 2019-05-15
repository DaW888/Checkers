const http = require('http');
const fs = require('fs');
const qs = require('querystring');

var usersTab = [];
var returnSetting = null;


var chessboardTab = [
    // light - 0, dark - 1;
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
];

// startowe rozmieszczenie pionkow
var checkersTab = [
    [0, 2, 0, 2, 0, 2, 0, 2], // 2 - czerwone
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1], // 1 - białe
    [1, 0, 1, 0, 1, 0, 1, 0],
];
const server = http.createServer(function(req, res) {
    console.log('adres url: ' + req.url);
    console.log(req.method);

    switch (req.method) {
    case 'GET':
        let adres = req.url;
        adres = adres.split('.');
        let extension = adres[adres.length - 1];
        const staticDir = 'static';
        console.log(extension);

        if (req.url === '/libs/jquery-3.3.1.min.js') {
            fs.readFile('.' + req.url, function(_error, data) {
                res.writeHead(200, {
                    'Content-Type': 'application/javascript',
                });
                res.write(data);
                res.end();
            });
        }
        if (req.url === '/libs/three.js') {
            fs.readFile('.' + req.url, function(_error, data) {
                res.writeHead(200, {
                    'Content-Type': 'application/javascript',
                });
                res.write(data);
                res.end();
            });
        }

        if (extension == '/') {
            fs.readFile(staticDir + '/index.html', function(_error, data) {
                res.writeHead(200, {
                    'Content-Type': 'text/html;charset=utf-8',
                });
                res.write(data);
                res.end();
            });
        } else if (extension == 'js' && req.url.search('jquery') < 0 && req.url.search('three') < 0) {
            fs.readFile(staticDir + req.url, function(_error, data) {
                res.writeHead(200, {
                    'Content-Type': 'application/javascript',
                });
                res.write(data);
                res.end();
            });
        } else if (extension == 'css') {
            fs.readFile(staticDir + req.url, function(_error, data) {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.write(data);
                res.end();
            });
        } else if (extension == 'jpg') {
            fs.readFile(__dirname + req.url, function(_error, data) {
                res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                res.write(data);
                res.end();
            });
        } else if (extension == 'png') {
            fs.readFile(__dirname + decodeURI(req.url), function(_error, data) {
                res.writeHead(200, { 'Content-Type': 'image/png' });
                res.write(data);
                res.end();
            });
        }

        break;

    case 'POST':
        servResponse(req, res);
        break;
    }
});

server.listen(3000, function() {
    console.log('server on port: 3000');
});

function servResponse(req, res) {
    let allData = '';

    req.on('data', function(data) {
        console.log('data: ' + data);
        allData += data;
    });

    req.on('end', function() { //(data) w function ale raczej nie trzeba
        const finish = qs.parse(allData);

        var result = null;
        switch (finish.action) {
        case 'addUser':
            // sprawdza czy taki user wystepuje juz w tabeli
            var isSameUser = usersTab.find(user => user === finish.user);
            if(!isSameUser){
                usersTab.push(finish.user); // w przyszłości socket.io i IP goscia
                if(usersTab.length > 2){
                    result = {message: 'Gra już za dużo użytkowników', canLogin: false};
                    usersTab.pop();
                }
                else
                    result = {message: 'Zalogowano', canLogin: true, users: usersTab};

            } else{
                result = {message: 'Taki użytkownik już istnieje', canLogin: false};
            }
            res.end(JSON.stringify(result, null, 2));
            break;


        case 'clearArray':
            usersTab = [];
            break;

        case 'getUsersArray':
            res.end(JSON.stringify(usersTab, null, 2));
            break;
        case 'updateCheckersArray':
            var setting = JSON.parse(finish.setting);
            console.log(setting);
            var kill = false;
            console.log(checkersTab[setting.from.x][setting.from.y]);
            console.log(checkersTab[setting.target.x][setting.target.y]);

            if(checkersTab[setting.target.x][setting.target.y] != 0)    kill = true;

            checkersTab[setting.from.x][setting.from.y] = 0;
            checkersTab[setting.target.x][setting.target.y] = setting.color == 'blueChecker' ? 1 : 2;
            console.log('asd' + checkersTab[setting.target.x][setting.target.y] + setting.color);

            returnSetting = {...setting, kill: kill};
            res.end(JSON.stringify({...setting, kill: kill}, null, 2));
            break;

        case 'getChanges':
            console.log(returnSetting);
            res.end(JSON.stringify(returnSetting, null, 2));
            returnSetting = null;
            break;
        }
    });
}
