const http = require("http");
const os = require("os");

http.createServer(function (request, response) {
    if (request.method === 'GET') {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        switch (request.url) {
            case '/dir_name':
                response.end(String(__dirname));
                break;
            case '/file_name':
                response.end(String(__filename));
                break;
            case '/cpus':
                response.end(JSON.stringify(os.cpus()));
                break;
            case '/number_of_cores':
                response.end(String(os.cpus().length));
                break;
            case '/home.html':
                response.end('This is home page');
                break;
            default:
                response.end('shit happens');
        }
    }

    if (request.method === 'POST') {
        let data = '';
        request.on('data', chunk => {
            data += chunk;
        })
        request.on('end', () => {
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');

            const crypto = require('crypto');

            const validPassword = crypto.pbkdf2Sync("supper-secure-password",
                'salt', 100000, 64, 'sha512').toString('hex');
            const password = crypto.pbkdf2Sync(JSON.parse(data).password, 'salt', 100000, 64, 'sha512').toString('hex');

            if (validPassword === password) {
                response.end(JSON.stringify({isValid: true}));
            } else {
                response.end(JSON.stringify({isValid: false}));
            }
        })

    }

}).listen(8080);