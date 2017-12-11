//All the includes we need to make stuff happen
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use('/static', express.static('public'));

//The mysql we include to connect to database
var mysql = require('mysql');
//Miguel's MySQL Connection
/*
var con = mysql.createConnection
({
	host: 'localhost',
	user: 'root',
	password: 'destiny2161', //read in the password from a file
	database: 'listy'
});
*/
//Sita's MySQL Connection
var con = mysql.createConnection
({
	host: 'localhost',
	user: 'dbuser',
	password: 'dbpassword',
	database: 'listy'
});

var ac = require('./account');
var account = new ac();
var ls = require('./list');
var list = new ls();
var sh = require('./share');
var share = new sh();

//login and registration

//Post a new user in the users data table
app.post('/register', function(req,res)
{	
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	account.once('reg', function(response)
	{	
		account.makeShareRow(req.body.user);
		res.end(response);
	});
	
	account.once('share', function(response)
	{	
		if(response == "makeuser")
		{
			//create list datatable for that user
			account.createUser(req.body.user);
		}
		else
		{
			res.end(response);
		}
	});
		
	account.register(req.body.user, req.body.passwrd, req.body.email);
});

//post request to login.
app.post('/login', function (req, res)
{
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	account.once('loggedin', function(response)
	{
		res.end(response);
	});
	
	account.login(req.body.user, req.body.passwrd);
});

//personal lists

//Post a new list in a users list datatable
app.post('/save', function(req,res)
{	
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	list.once('save', function(response)
	{
		res.end(response);
	});
		
	list.savelist(req.body.user, req.body.lsTitle, req.body.list);
});

//update a list in the user data table
app.post('/update', function(req,res)
{	
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	list.once('update', function(response)
	{
		res.end(response);
	});

	list.updatelist(req.body.user, req.body.lsTitle, req.body.list, req.body.lsId, req.body.oldTitle);
});

//Delete a users list from their datatable
app.post('/delete', function(req,res)
{	
	res.writeHead(200, {'Content-Type': 'text/html'});	
	
	list.once('delete', function(response)
	{
		res.end(response);
	});
	
	list.deletelist(req.body.user, req.body.lsTitle, req.body.lsId);
});

//Get lists from users list datatable
app.get('/getlists', function(req,res)
{	
	list.once('got', function(lists)
	{
		res.send(lists);
	});
	
	list.getlists(req.query.user);
});

//Get list items from users list datatable
app.get('/getitems', function(req,res)
{	
	list.once('goti', function(lItems) 
	{
		console.log(lItems);
		var list = "";
		var id = "";
		var lItemsSplit = lItems.split("><$><");
		
		if(lItems == "fail")
		{
			list = "Error getting list items";
			id = "";
		}
		else
		{
			list = lItemsSplit[0];
			id = lItemsSplit[1];
			shared = lItemsSplit[2];
		}
		
		res.send(JSON.stringify({itemlist: list, listid: id, alshared: shared}));
	});
	
	list.getlistitems(req.query.user,req.query.listname);
});

//sharing 

//share list with another user
app.post('/share', function(req,res)
{	
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	share.once('shared', function(response)
	{	
		res.end(response);
	});
	share.ShareLs(req.body.userShared,req.body.userSharing,req.body.lsName,req.body.lsId);
});
//get lists shared with a user
app.get('/sharedLists', function(req,res)
{	
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	share.once('gotSharedLists', function(response)
	{	
		console.log(response);
		res.end(response);
	});
	share.getShareLists(req.query.userShared);
});
//Get shared list items from users list datatable
app.get('/getSharedItems', function(req,res)
{	
	share.once('gotSharedItems', function(lItems) 
	{
		console.log(lItems);
		if(lItems == "fail")
		{
			lItems = "Error getting list items";
		}
		res.send(lItems);
	});
	
	console.log(req.query.userShared);
	console.log(req.query.listid);
	
	share.getSharedItems(req.query.userShared,req.query.listid);
});
//update a shared list
app.post('/updateSharedList', function(req,res)
{	
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	share.once('updateShared', function(response)
	{
		res.end(response);
	});
	share.updateSharedList(req.body.userShared, req.body.lsTitle, req.body.list, req.body.lsId);
});
//listen for localhost 8080
app.listen(8080, function()
{
	console.log('It Works!...');
});