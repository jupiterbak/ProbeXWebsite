/*#####################################################################################*/
/* General options	
/*#####################################################################################*/
const fs = require('fs');
const path = require('path');
var http = require('http');
var express = require('express'),
    app = module.exports.app = express();
var morgan = require('morgan');
var rfs = require('rotating-file-stream'); // version 2.x
var bodyParser     =        require("body-parser");
var webserver = http.createServer(app);
var io = require('socket.io').listen(webserver);
var nodemailer = require('nodemailer');

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
/* Initialze Morgan library
/*#####################################################################################*/
// create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
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
/* MAil recipient
/*#####################################################################################*/
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jupiter.bakakeu@gmail.com',
      pass: 'BAK$850rom'
    }
  });
 
/*#####################################################################################*/
/*WEB Server		
/*#####################################################################################*/
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/contact', function(req,res){
    res.sendFile(__dirname + '/public/contact.html');
});

app.post('/mail', function(req,res){
    var mailOptions = {
        from: 'jupiter.bakakeu@gmail.com',
        to: 'jupiter.bakakeu@yahoo.com;Dominik.Kisskalt@faps.fau.de',
        subject: 'New contact mail from probeX.io Website',
        text: req.body
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ err:null}));
});

app.get('/product', function(req,res){
    res.redirect('/#product');
});
app.get('/usecases', function(req,res){
    res.redirect('/#usecases');
});
app.get('/insights', function(req,res){
    res.redirect('/#insights');
});
app.get('/about', function(req,res){
    res.redirect('/#about');
});

app.get('/vision', function(req,res){
    res.redirect('/');
});

app.get('/case_study', function(req,res){
    res.redirect('/');
});

app.get('/legal-notices', function(req,res){
    res.sendFile(__dirname + '/public/legal-notices.html');
});

app.all('*', (req, res) => {
    res.sendFile(__dirname + '/public/404.html');
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