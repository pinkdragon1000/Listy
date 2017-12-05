
function logout()
{
	sessionStorage.removeItem('username');
	location.href = "http://localhost:8080/index.html";
}

function seelist(user, listid, listname)
{
	sessionStorage.sharedUser = JSON.stringify(user);
	sessionStorage.sharedListId = JSON.stringify(listid);
	sessionStorage.sharedListName = JSON.stringify(listname);
	location.href = "http://localhost:8080/listshared.html";
}

window.onload = function WindowLoad(event) 
{	
	var userName = JSON.parse(sessionStorage.username);
	var urlrequest = "http://localhost:8080/sharedLists";
	var listsDisplay = document.getElementById("output");
	
	$.ajax
	({
		type: "GET",
		url: urlrequest,
		dataType: "HTML",   
		data: {userShared: userName},
		contentType:"application/json",
		success : function(lists)  //the response
		{	
			listsDisplay.innerHTML = lists;
		},
		//Just in case the connection fails for some reason.
		error: function(jgXHR, textStatus,errorThrown)
		{
			alert("Error: " + textStatus + " " + errorThrown);
		}
	});
}

