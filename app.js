/*#####################################################################################*/
/* General options	
/*#####################################################################################*/
const fs = require('fs');
const path = require('path');
var http = require('http');
var express = require('express'),
	app = module.exports.app = express();
var bodyParser     =        require("body-parser");
var webserver = http.createServer(app);
var io = require('socket.io').listen(webserver);


port = process.env.PORT || 80;

/*#####################################################################################*/
/* Winston
/*#####################################################################################*/
const winston = require('winston');
const logger = winston.createLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.colorize({ all: true }),
        winston.format.printf((log) => {
            return `${log.timestamp} - [${log.level}] | [${log.service}] : ${log.message}`;
        })
    ),
    defaultMeta: { service: 'FAPS SCREEN' },
});

/*#####################################################################################*/
/* Socket IO
/*#####################################################################################*/

//SocketIO handler
io.on('connection', function(socket) {
	logger.info("Socket IO Connection");
	socket.on('disconnect', function(){
		logger.info("Socket IO Disconnection");
	});
});

 
/*#####################################################################################*/
/*WEB Server		
/*#####################################################################################*/
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/contact', function(req,res){
    res.sendFile(__dirname + '/public/contact.html');
});

webserver.listen(port, function() {
    logger.info('SCREEN app listening on port: ' + port);

});

process.on('uncaughtException', function(err) {
    logger.error('SCREEN app Uncaught Exception:' + err.stack);
    logger.error('SCREEN app server is on exit with code: ' + 1);
    webserver.close();
    process.exit(1);
});

// Stop the platform if the user request it
process.on('SIGINT', function() {
    logger.error('SCREEN app is on exit with code: ' + 0);
    webserver.close();
    process.exit(0);
});

process.on('exit', (code) => {
    logger.error('SCREEN app is on exit with code: ' + code);
    webserver.close();
    process.exit(0);
});