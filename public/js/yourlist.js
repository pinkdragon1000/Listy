
	function logout()
	{
		sessionStorage.removeItem('username');
		location.href = "http://localhost:8080/index.html";
	}
	
	function addItem()
	{
	
		var list = document.getElementById('List-Item');
		var writtenItems = document.getElementsByClassName('form-control');
		var listChecks = document.getElementsByClassName('check-control');
		var itemsString = "";
		var checksString = "";
		
		for (var i = 0; i < writtenItems.length; i++)
		{
			itemsString += writtenItems[i].value;
			itemsString += "&%$";
		}
		for (var i = 0; i < listChecks.length; i++)
		{
			checksString += listChecks[i].checked;
			checksString += "&%$";
		}
		
		list.innerHTML += '\n<div class="input-group">\n<span class="input-group-addon">\n<input type="checkbox" class="check-control" value="false" aria-label="Checkbox for following text input">\n</span>\n<input type="text" value="" class="form-control" aria-label="Text input with checkbox" placeholder="List Item">\n</div>';
	
		writtenItemsAfter = itemsString.split("&%$");
		listChecksAfter = checksString.split("&%$");
		
		for (var i = 0; i < writtenItems.length; i++)
		{
			writtenItems[i].value = writtenItemsAfter[i];
		}
		for (var i = 0; i < listChecks.length; i++)
		{
			if (listChecksAfter[i] == "true")
			{
				listChecks[i].checked = true;
			}
		}
	}

	window.onload = function WindowLoad(event) 
	{	
		var userDisplay = document.getElementById('usern');
		var userName = JSON.parse(sessionStorage.username);
		userDisplay.innerHTML = "Lislet Author: " + userName;
		var listName = JSON.parse(sessionStorage.listname);
		
		if (listName != "")
		{
			//make the correct author name show up
			var urlrequest = "http://localhost:8080/getitems";
			var outputList = document.getElementById('List-Item');	
			var alshared = document.getElementById('alreadyShared');
			var listTitle = document.getElementsByClassName('title');
			var listChecks = document.getElementsByClassName('check-control');
		
			listTitle[0].value = listName;
		
			$.ajax
			({
				type: "GET",
				url: urlrequest,
				dataType: "HTML",   
				data: {user: userName, listname: listName},
				contentType:"application/json",
				success : function(items)  //the response
				{	
					items = JSON.parse(items);
					outputList.innerHTML = items.itemlist;
					listTitle[0].id = items.listid;
					alshared.innerHTML = "Users already shared with:\n";
					
					if (items.alshared != "undefined")
					{
						alshared.innerHTML += items.alshared;
					}
					for (var i = 0; i < listChecks.length; i++)
					{
						if (listChecks[i].value == "true")
						{
							listChecks[i].checked = true;
						}
					}
				},
				//Just in case the connection fails for some reason.
				error: function(jgXHR, textStatus,errorThrown)
				{
					alert("Error: " + textStatus + " " + errorThrown);
				}
			});
		}
	}
	
	function saveList(pass)
	{
		var listTitle = document.getElementsByClassName('title');
	
		if (listTitle[0].value == "")
		{
			listTitle[0].value = "< This list must have a title to be saved! >";
		}
		else
		{
			var listItems = document.getElementsByClassName('form-control');
			var listChecks = document.getElementsByClassName('check-control');
			var urlrequest = "http://localhost:8080/update";
			var userName = JSON.parse(sessionStorage.username);
			var oldListName = JSON.parse(sessionStorage.listname);
			var listId = listTitle[0].id;
			var listString = "";
			
			if (JSON.parse(sessionStorage.listname) == "")
			{
				urlrequest = "http://localhost:8080/save";
			}
			//make check pass through
			if (pass == 'save')
			{
				for (var i = 0; i < listItems.length; i++) 
				{
					if (listChecks[i].checked == true)
					{
						listChecks[i].value = "true";
					}
					else
					{
						listChecks[i].value = "false";
					}
					listString += "<div class=\"input-group\">\n<span class=\"input-group-addon\">\n<input type=\"checkbox\" class=\"check-control\" value=\"";
					listString += listChecks[i].value;
					listString += "\" aria-label=\"Checkbox for following text input\">\n</span>\n<input type=\"text\" value=\"";
					listString += listItems[i].value;
					listString += "\" class=\"form-control\" aria-label=\"Text input with checkbox\" placeholder=\"List Item\">\n</div>%";
				}
			}
			else
			{
				if (window.confirm("Are you sure you want to delete this list?"))
				{
					urlrequest = "http://localhost:8080/delete"; 
				}
			}
			$.ajax
			({
				type: "POST",
				url: urlrequest,
				dataType: "HTML",   
				data: JSON.stringify({list: listString, lsTitle: listTitle[0].value, user: userName, lsId: listId, oldTitle: oldListName}),
				contentType:"application/json",
				success : function(response)  //the response
				{	
					if (response == "fail")
					{
						listTitle[0].value = "< List should have unique name! >";
					}
					else
					{					
						location.href="http://localhost:8080/yourchecklists.html";
					}
				},
				//Just in case the connection fails for some reason.
				error: function(jgXHR, textStatus,errorThrown)
				{
					alert("Error: " + textStatus + " " + errorThrown);
				}
			});
		}
	}
	
	function shareList()
	{
		var listTitle = document.getElementsByClassName('title');
		var sharie = document.getElementById('username');
		var alshared = document.getElementById('alreadyShared');
	
		if (listTitle[0].value == "")
		{
			sharie.value = "< List must have title! >";
		}
		else if (sharie.value == "")
		{
			sharie.value = "< Please enter username! >";
		}
		else
		{
			var urlrequest = "http://localhost:8080/share";
			var userName = JSON.parse(sessionStorage.username);
			var listId = listTitle[0].id;
			var listname = listTitle[0].value;

			$.ajax
			({
				type: "POST",
				url: urlrequest,
				dataType: "HTML",   
				data: JSON.stringify({userShared: sharie.value, userSharing: userName, lsName: listname, lsId: listId}),
				contentType:"application/json",
				success : function(response)  //the response
				{		
					if (response == '< Successfully Shared! >')
					{
						alshared.innerHTML += " " + sharie.value;
					}
					sharie.value = response;
					setTimeout(function()
					{ 
						sharie.value = "";
						document.getElementById('shareModal').style.display='none';		
					}, 1500);	
				},
				//Just in case the connection fails for some reason.
				error: function(jgXHR, textStatus,errorThrown)
				{
					alert("Error: " + textStatus + " " + errorThrown);
				}
			});
			
		}
	}

