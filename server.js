var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var crypto = require('crypto');

var jwt = require('jsonwebtoken');
var config = require('./config');


// =======================
// configuration =========
// =======================
//for crypto
var algorithm = "SHA1"


var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
app.set('githubSecret', config.secret); // secret variable
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
app.get('/', function (req, res) {
	res.send('Hello! The API is at http://localhost:' + port + '/api');
});
app.get('/update/:repositoryName', function (req, res) {
	var body = req.body;
	var hmac = crypto.createHmac(algorithm, config.secret);
	hmac.setEncoding('hex');
	//check if the signature is correct.
	hmac.end(body, function () {
		hash = hmac.read();
		if (req.header('X-Hub-Signature') === hash){
			//the signature is correct. Carry on.
			console.log("Signature verified");
		}else{
			res.error("Error, signautre doesn't check out.");
		}
	});
});
app.get('/update/nocheck'){
	var body = req.body;
	var hmac = crypto.createHmac(algorithm, config.secret);
	hmac.setEncoding('hex');
	//check if the signature is correct.
	hmac.end(body, function () {
		hash = hmac.read();
		if (req.header('X-Hub-Signature') === hash){
			//the signature is correct. Carry on.
		}else{
			res.error("Error, signature doesn't check out.");
		}
	});
}
function updateRepository(){
	//TODO: Finish the code here.
}
// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);