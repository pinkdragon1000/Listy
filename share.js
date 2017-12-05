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
		console.log(err);
		console.log('Error connecting to database');
	}
});

function share()
{
	EventEmitter.call(this);
}
utils.inherits(share,EventEmitter);

//share with user
function completeShare(userShared,sharefrom,listnms,listids)
{		
	con.query('UPDATE usershared SET sharedfrom = \''+sharefrom+'\', listids = \''+listids+'\', listnames = \''+listnms+'\' WHERE username = \''+userShared+'\'',
	function(err)
	{
		if(err)
		{
			console.log('Error sharing list');
		}
	}
	);
};
//Insert new user that list has been shared with
function insertNewSharie(userShared,userSharing,lsid)
{
	var sharie = "";
	
	con.query('SELECT shared FROM '+userSharing+'Table WHERE lid = \''+lsid+'\'',
	function(err, rows)
	{
		console.log(rows[0].shared);
		if(err)
		{
			console.log('Error sharing list');
		}
		else
		{
			sharie = rows[0].shared + "<%>" + userShared;
			
			con.query('UPDATE '+userSharing+'Table SET shared = \''+sharie+'\' WHERE lid = \''+lsid+'\'',
			function(err)
			{
				if(err)
				{
					console.log('Error sharing list');
				}
			}	
			);
		}
	}
	);
};
//attempt to share list with another user.
share.prototype.ShareLs=function(userShared,userSharing,lsname,lsid)
{
	var self = this;
		
	con.query('SELECT sharedfrom, listids, listnames FROM usershared WHERE username = \''+userShared+'\'',
	function(err,rows)
	{
		if(err)
		{
			console.log('Error sharing list');
			self.emit('shared','< Error >');
		}
		else if (rows.length < 1)
		{
			self.emit('shared','< User doesn\'t exist! >');
		}
		else
		{
			var i = 2;
			var i2 = 3;
			var shareOrNot = true;
			var sharedlists = rows[0].listids.split("<%>");
			
			while ( i < sharedlists.length )
			{	
				if ((sharedlists[i] + "<%>" + sharedlists[i2]) == lsid)
				{
					shareOrNot = false;
				}
				i += 2;
				i2 += 2;
			}
			
			if (shareOrNot)
			{
				var sharefrom = rows[0].sharedfrom + "<%>";
				sharefrom += userSharing;
				var listids = rows[0].listids + "<%>";
				listids += lsid;
				var listnms = rows[0].listnames + "<%>";
				listnms += lsname;
				insertNewSharie(userShared,userSharing,lsid);
				completeShare(userShared,sharefrom,listnms,listids);
				self.emit('shared','< Successfully Shared! >');
			}
			else
			{
				self.emit('shared','< List already shared! >');
			}
		}
	}
	);
};
//get shared lists
share.prototype.getShareLists=function(username)
{
	var self = this;
	var lists = "<table data-role=\"table\" data-mode=\"reflow\" class=\"ui-responsive\"><tbody id=\"toutput\">\n";
	
	con.query('SELECT sharedfrom, listids, listnames FROM userShared WHERE username = \''+username+'\'',
	function(err,rows)
	{
		if(err)
		{
			console.log('Error getting shared items');
			self.emit('gotSharedLists','fail');
		}
		else if (rows.length < 1)
		{
			self.emit('gotSharedLists','No lists shared yet.');
		}
		else
		{
			var sharedusers = rows[0].sharedfrom.split("<%>");
			var sharedlists = rows[0].listids.split("<%>");
			var sharednames = rows[0].listnames.split("<%>");
			var i = 2;
			var i2 = 3;
			var i3 = 2;
		
			while (i < sharedlists.length)
			{
				id = sharedlists[i] + "<%>" + sharedlists[i2];
				lists += "<tr><td><a href=\"#\" onclick=\"seelist('"+sharedusers[i3]+"', '"+id+"', '"+sharednames[i3]+"'); return false;\" data-ajax='false'><button type='button' class='listButton'> " +sharednames[i3]+ " </button></a></td></tr>\n";
				i += 2;
				i2 += 2;
				i3 += 1;
			}		
			lists += "</tbody></table>";
			self.emit('gotSharedLists',lists);
		}
	}
	);
};
//update shared list
share.prototype.updateSharedList=function(username,title,list,id)
{
	var self = this;
		
	con.query('UPDATE '+username+'Table SET lname = \''+title+'\', ltext = \''+list+'\' WHERE lid = \''+id+'\'',
	function(err)
	{
		if(err)
		{
			console.log('Error updating list');
			self.emit('updateShared','Error updating list');
		}
		else
		{
			self.emit('updateShared','success');
		}
	}
	);
};

//get items in shared list
share.prototype.getSharedItems=function(userShared,listid)
{
	var self = this;
	var items = "";
	
	con.query('SELECT ltext FROM '+userShared+'Table WHERE lid = \''+listid+'\'',
	function(err,rows)
	{
		if(err)
		{
			console.log('Error getting list items at getSharedItems');
			self.emit('gotSharedItems','fail');
		}
		else
		{
			var listitems = rows[0].ltext.split("%");
			
			for (var i = 0; i < listitems.length; i++)
			{
				items += listitems[i];
			}		
			
			self.emit('gotSharedItems',items);
		}
	}
	);
};

//exports lol
module.exports = share;

