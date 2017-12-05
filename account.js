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
	password: 'destiny2161', //read in the password from a file
	database: 'listy'
});

con.connect(function(err) 
{
	if (err) 
	{
		console.log('Error connecting to database');
		console.log(err);
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
				self.emit('loggedin','logged');
			}
			else
			{
				self.emit('loggedin','Incorrect username or password.');
			}
		}
	}
	);
};

account.prototype.register=function(username,password,email)
{
	var self = this;
		
	con.query('INSERT INTO users (username, password, email) VALUES (\''+username+'\', PASSWORD(\''+password+'\'), \''+email+'\')',
	function(err)
	{
		if(err)
		{
			self.emit('share','User already exists!');
		}
		else
		{
			self.emit('share','makeuser');
		}
	}
	);
};

account.prototype.createUser=function(username)
{
	console.log('new user table');
	
	var self = this;
	
	con.query('CREATE TABLE '+username+'Table (lid VARCHAR(100) UNIQUE, lname VARCHAR(100) UNIQUE, ltext VARCHAR(5000), shared VARCHAR(1000))',
	function(err)
	{
		if(err)
		{
			self.emit('reg','User already exists!');
		}
		else
		{
			self.emit('reg','register');
		}
	}
	);
};

account.prototype.makeShareRow=function(username)
{
	console.log('Put into usershared table for shared lists');
	
	var self = this;
	var place = "<%>";
	
	con.query('INSERT INTO userShared (username,sharedfrom,listids,listnames) VALUES (\''+username+'\',\''+place+'\',\''+place+'\',\''+place+'\')',
	function(err)
	{
		if(err)
		{
			console.log('User cant share :(');
		}
	}
	);
};
//exports lol
module.exports = account;

