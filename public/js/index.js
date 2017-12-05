
function login(enter,username,password,email,result)
{	
	var userName = document.getElementById(username);
	var passwrd = document.getElementById(password);
	var userEmail = document.getElementById(email);
	var resultDisplay = document.getElementById(result);
	var urlrequest = "http://localhost:8080/" + enter;
	
	if ((enter == "login" && userName.value == "" || passwrd.value == "") || (enter == "register" && userEmail.value == "" || passwrd.value == "" || userName.value == ""))
	{
		userName.value = "";
		passwrd.value = "";
		userEmail.value = "";
		resultDisplay.innerHTML = "Please input into all fields!";
	}
	else
	{	
		$.ajax
		({
			type: "POST",
			url: urlrequest,
			dataType: "HTML",   
			data: JSON.stringify({user: userName.value, passwrd: passwrd.value, email: userEmail.value}),
			contentType:"application/json",
			success : function(response)  //the response
			{	
				if (response != 'logged' && response != 'register')
				{
					resultDisplay.innerHTML = response;
				}
				else
				{
					sessionStorage.username = JSON.stringify(userName.value);
					userName.value = "";
					passwrd.value = "";
					userEmail.value = "";
					location.href="http://localhost:8080/main.html";
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

