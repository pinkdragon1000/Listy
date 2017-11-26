//All the includes we need to make stuff happen
var EventEmitter = require('events').EventEmitter;
var utils = require('util');
var page = require('fs');
//The mysql we include to connect to databases
var mysql = require('mysql');
var con = mysql.createConnection
({
	host: 'localhost',
	user: 'root',
	password: 'destiny2161',
	database: 'listy'
});

con.connect(function(err) 
{
	if (err) 
	{
		console.log(err);
		console.log('Error connecting to database');
	}
});

function account()
{
	EventEmitter.call(this);
}
utils.inherits(account,EventEmitter);

account.prototype.login=function(username,password)
{
	var self = this;
	
	con.query('SELECT id FROM users WHERE username=\''+username+'\' AND password=PASSWORD(\''+password+'\')',
	function(err, rows)
	{
		if(err)
		{
			console.log('Error');
		}
		else
		{
			if(rows.length > 0)
			{
				self.emit('loggedin',1);
			}
			else
			{
				self.emit('loggedin',0);
			}
		}
	}
	);
};

account.prototype.register=function(username,password,email)
{
	var self = this;
	
	console.log(username);
	console.log(password);
	console.log(email);
	
	con.query('INSERT INTO users (username, password, email) VALUES (\''+username+'\', PASSWORD(\''+password+'\'), \''+email+'\')',
	function(err)
	{
		if(err)
		{
			console.log('user exists already');
			self.emit('reg',0);
		}
		else
		{
			self.emit('reg',1);
		}
	}
	);
};

account.prototype.createUser=function(username)
{
	console.log(username);
	
	con.query('CREATE TABLE '+username+'Table (lname VARCHAR(100), ltext VARCHAR(5000), shared VARCHAR(1000))',
	function(err)
	{
		if(err)
		{
			console.log('Datatable not created :(');
		}
	}
	);
};
//exports lol
module.exports = account;

