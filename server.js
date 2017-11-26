//All the includes we need to make stuff happen
var http = require('http');
var express = require('express');
var app = express();
var page = require('fs');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static("."));
//The mysql we include to connect to database
var mysql = require('mysql');
var con = mysql.createConnection
({
	host: 'localhost',
	user: 'root',
	password: 'destiny2161',
	database: 'listy'
});
/*
var session = require('client-sessions');
app.use(session(
{
	cookieName: 'session',
	secret: 'sesdeswedkrbee', 
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
}));
*/
var ac = require('./account');
var lg = new ac();

app.use(express.static('public'))
app.use('/static', express.static('public'))

//Post a new user in the users data table
app.post('/register', function(req,res)
{	
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	lg.once('reg', function(msg)
	{
		var resp = "";
		
		if(msg == 1)
		{
			//create list datatable for that user
			lg.createUser(req.body.us);
			resp = "register";
		}
		else
		{
			resp = "User already exists!";
		}
		res.end(resp);
	});
		
	lg.register(req.body.us, req.body.ps, req.body.em);
});
//post request to login.
app.post('/login', function (req, res)
{
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	lg.once('loggedin', function(msg)
	{
		var resp = "";
		
		if(msg == 1)
		{
			//req.session.userid = req.query.us;
			resp = "logged";
		}
		else
		{
			//req.session.msg = 'Login failed';
			resp = "Incorrect username or password.";
		}
		res.end(resp);
	});
	
	lg.login(req.body.us, req.body.ps);
});
//listen for localhost 8080
app.listen(8080, function()
{
	console.log('It Works!...');
});