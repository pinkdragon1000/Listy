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

function updateShareName(username,title,oldtitle)
{
	console.log(username);
	console.log(title);
	console.log(oldtitle);
	
	con.query('SELECT shared FROM '+username+'Table',
	function(err,rows)
	{
		if(err)
		{
			console.log('Error sharing lists');
		}
		else
		{
			var sharies = rows[0].shared.split("<%>");
			
			if (sharies.length > 1)
			{
				for (var i = 1; i < sharies.length; i++)
				{
					con.query('SELECT username, listnames FROM usershared WHERE username=\''+sharies[i]+'\'',
					function(err,rows)
					{
						var names = rows[0].listnames.split(oldtitle);
						var newnames = names[0] + title + names[1]; 
						var user = rows[0].username;

						con.query('UPDATE usershared SET listnames = \''+newnames+'\' WHERE username = \''+user+'\'',
						function(err)
						{
							console.log("changing name in usershared");
						}
						);
					}
					);
				}
			}
			
		}
	}
	);
}

function deleteSharedList(username,title,id)
{
	con.query('SELECT shared FROM '+username+'Table',
	function(err,rows)
	{
		if(err)
		{
			console.log('Error sharing lists');
		}
		else
		{
			var sharies = rows[0].shared.split("<%>");
			
			if (sharies.length > 1)
			{
				for (var i = 1; i < sharies.length; i++)
				{
					con.query('SELECT username, sharedfrom, listids, listnames FROM usershared WHERE username=\''+sharies[i]+'\'',
					function(err,rows)
					{
						var user = rows[0].username;
						var listnames = rows[0].listnames.split("<%>");
						var listshared = rows[0].sharedfrom.split("<%>");
						var listids = rows[0].listids.split("<%>");
						var newlistnames = "<%>";
						var newlistshared = "<%>";
						var newlistids = "<%>";
						var i2 = 2;
						
						for (var i = 2; i < listnames.length; i++)
						{
							if (listnames[i] != title)
							{
								newlistnames += "<%>";
								newlistnames += listnames[i];
								newlistshared += "<%>";
								newlistshared += listshared[i];
								newlistids += "<%>";
								newlistids += listids[i2];
								newlistids += "<%>";
								newlistids += listids[i2+1];
							}
							i2 = i2 + 2;
						}
						
						con.query('UPDATE usershared SET sharedfrom = \''+newlistshared+'\', listids = \''+newlistids+'\', listnames = \''+newlistnames+'\' WHERE username = \''+user+'\'',
						function(err)
						{
							console.log("deleting list in usershared");
						}
						);
					}
					);
				}
			}
		}
	}
	);
	
}

function list()
{
	EventEmitter.call(this);
}
utils.inherits(list,EventEmitter);
//save the list
list.prototype.savelist=function(username,title,list)
{
	var self = this;
	lid = username+"<%>"+title;
	
	con.query('INSERT INTO '+username+'Table (lid, lname, ltext, shared) VALUES (\''+lid+'\', \''+title+'\', \''+list+'\', \''+username+'\')',
	function(err)
	{
		if(err)
		{
			console.log('Error saving list');
			self.emit('save','fail');
		}
		else
		{
			self.emit('save','success');
		}
	}
	);
};
//update list
list.prototype.updatelist=function(username,title,list,id,oldtitle)
{
	var self = this;
		
	con.query('UPDATE '+username+'Table SET lname = \''+title+'\', ltext = \''+list+'\' WHERE lid = \''+id+'\'',
	function(err)
	{
		if(err)
		{
			console.log('Error updating list');
			self.emit('update','Error updating list');
		}
		else
		{
			updateShareName(username,title,oldtitle);
			self.emit('update','success');
		}
	}
	);
};
//delete list
list.prototype.deletelist=function(username,title,id)
{
	var self = this;
				
	deleteSharedList(username,title,id);

	con.query('DELETE FROM '+username+'Table WHERE lname=\''+title+'\'',
	function(err)
	{
		if(err)
		{
			console.log('Error deleting list');
			self.emit('delete','Error deleting list');
		}
		else
		{
			self.emit('delete','success');
		}
	}
	);
};
//get list
list.prototype.getlists=function(username)
{
	var self = this;
	var lists = "<table data-role=\"table\" data-mode=\"reflow\" class=\"ui-responsive\"><tbody id=\"toutput\">\n";
	
	con.query('SELECT lname FROM '+username+'Table',
	function(err,rows)
	{
		if(err)
		{
			console.log('Error getting lists');
			self.emit('got','Error getting lists');
		}
		else
		{
			for (var i = 0; i < rows.length; i++)
			{
				lists += "<tr><td><a href=\"#\" onclick=\"addlist('"+rows[i].lname+"'); return false;\" data-ajax='false'><button type='button' class='listButton'> " +rows[i].lname+ " </button></a></td></tr>\n";
			}
			lists += "</tbody></table>";
			self.emit('got',lists);
		}
	}
	);
};
//get items in list
list.prototype.getlistitems=function(username,listname)
{
	var self = this;
	var items = "";
	var shared = "";
	
	con.query('SELECT lid, ltext, shared FROM '+username+'Table WHERE lname = \''+listname+'\'',
	function(err,rows)
	{
		if(err)
		{
			console.log('Error getting list items');
			self.emit('goti','fail');
		}
		else
		{
			var listitems = rows[0].ltext.split("%");
			
			for (var i = 0; i < listitems.length; i++)
			{
				items += listitems[i];
			}		
			items += "><$><";
			items += rows[0].lid;
			
			var listshared = rows[0].shared.split("<%>");
			
			for (var i2 = 1; i2 < listshared.length; i2++)
			{
				shared += listshared[i2];
				
				if (i2%3 == 0)
				{
					shared += "<br>";
				}
				else
				{
					shared += "  ";
				}
			}
			items += "><$><";
			items += shared;
			
			self.emit('goti',items);
		}
	}
	);
};

//exports lol
module.exports = list;

