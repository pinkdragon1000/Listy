
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
		var userName = JSON.parse(sessionStorage.sharedUser);
		var listName = JSON.parse(sessionStorage.sharedListId);
		var listNameSplit = listName.split("<%>");
		userDisplay.innerHTML = "Lislet Author: " + userName;
		
		if (listName != "")
		{
			//make the correct author name show up
			var urlrequest = "http://localhost:8080/getSharedItems";
			var outputList = document.getElementById('List-Item');	
			var listTitle = document.getElementsByClassName('title');
			var listChecks = document.getElementsByClassName('check-control');
		
			listTitle[0].value = JSON.parse(sessionStorage.sharedListName);
			listTitle[0].id = listName;
		
			$.ajax
			({
				type: "GET",
				url: urlrequest,
				dataType: "HTML",   
				data: {userShared: userName, listid: listName},
				contentType:"application/json",
				success : function(items)  //the response
				{	
					outputList.innerHTML = items;
					
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
	
	function saveList()
	{
		var listTitle = document.getElementsByClassName('title');
		var listItems = document.getElementsByClassName('form-control');
		var listChecks = document.getElementsByClassName('check-control');
		var urlrequest = "http://localhost:8080/updateSharedList";
		var userName = JSON.parse(sessionStorage.sharedUser);
		var listId = listTitle[0].id;
		var listString = "";
			
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
		
		$.ajax
		({
			type: "POST",
			url: urlrequest,
			dataType: "HTML",   
			data: JSON.stringify({list: listString, lsTitle: listTitle[0].value, userShared: userName, lsId: listId}),
			contentType:"application/json",
			success : function(response)  //the response
			{	
				if (response != "fail")
				{
					location.href="http://localhost:8080/checklistsshared.html";
				}	
			},
			//Just in case the connection fails for some reason.
			error: function(jgXHR, textStatus,errorThrown)
			{
				alert("Error: " + textStatus + " " + errorThrown);
			}
		});
		
	}
	
	
	

