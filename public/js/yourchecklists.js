
function logout()
	{
		sessionStorage.removeItem('username');
		location.href = "http://localhost:8080/index.html";
	}
function addlist(list)
{
	if (list == 'add')
	{
		sessionStorage.listname = JSON.stringify("");
		location.href = "http://localhost:8080/yourlist.html";
	}
	else
	{
		sessionStorage.listname = JSON.stringify(list);
		location.href = "http://localhost:8080/yourlist.html";
	}
}
	
window.onload = function WindowLoad(event) 
{	
	var userName = JSON.parse(sessionStorage.username);
	var urlrequest = "http://localhost:8080/getlists";
	var listsDisplay = document.getElementById("output");
	
	$.ajax
	({
		type: "GET",
		url: urlrequest,
		dataType: "HTML",   
		data: {user: userName},
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

