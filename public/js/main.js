
window.onload = function WindowLoad(event) 
{	
	var user = JSON.parse(sessionStorage.username);
	var userDisplay = document.getElementById('wuser');
	userDisplay.innerHTML = "Welcome " + user + " !";
}

function logout()
{
	sessionStorage.removeItem('username');
	location.href = "http://localhost:8080/index.html";
}
