//Requires express, fs, and body-parser
const express = require('express')
const app = express()
const fs = require('fs');
var bodyParser = require("body-parser");

//const calculator=require("./yourchecklists");
//const Weather=require("./weather").Weather;

//app.use(express.static(__dirname + '/images'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static('public'))
app.use('/static', express.static('public'))

/*
//Express get handler for static web page.
app.get('/', function (req, res) {
 fs.readFile('../index.html', function (err, html) {
        if (err) throw err;
        res.writeHead(200, {'Content-Type': 'text/html'}); 
        res.write(html);  
        res.end();  
    });
    

});
*/

/*

//Get handler that takes in the calculator.html file and responds with its contents 
app.get('/yourchecklists.html', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'}); 
    res.write(yourchecklists.render());  
    res.end();  
    
});

/*

//Get handler that takes in the weather.html file and responds with its contents. 
app.get('/weather.html', function (req, res) {
    var w=new Weather();
    res.writeHead(200, {'Content-Type': 'text/html'}); 
    res.write(w.render());  
    res.end();  
    
});

//Get handler for a web service that returns the weather as a formatted HTML table.  
app.get('/getWeather', function (req, res) {
    var w=new Weather();
    //Listens for the weatherReceived event once the HTML table is ready to be rendered.
    w.once('weatherReceived',function(table){
        res.writeHead(200, {'Content-Type': 'text/html'}); 
        res.write(table);  
        res.end();  
    });
    //Invoke getWeather to start the process of retrieving the weather from Weather Underground.  
    w.getWeather();
});




//I added support to handle the web service for both get and post
//Express post handler for the summation web service.  
app.post('/sum', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'}); 
    if(req.body.n<0 || req.body.n==undefined || req.body.n==""){
        res.write("Seed value can't be less than 0 (negative) or undefined");
    }
    else{
        res.write("The summation for "+ req.body.n+ " is "+calculator.computeSummation(req.body.n));
    }
    res.end();
    
});

//Express post handler for the factorial web service.  
app.post('/fact', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'}); 
    if(req.body.n<0 || req.body.n==undefined || req.body.n==""){
        res.write("Seed value can't be less than 0 (negative) or undefined");
    }
    else{
        res.write("The factorial for "+ req.body.n+ " is "+calculator.computeFactorial(req.body.n));
    }
    res.end();
});

//Express the get handler for the factorial web service.
app.get('/sum', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'}); 
    console.log("get for sum");
    var n=req.param("n");
    if(n<0 || n==undefined || n==""){
        res.write("Seed value can't be less than 0 (negative) or undefined");
    }
    else{
        res.write("The summation for "+ n+ " is "+calculator.computeSummation(n));
    }
    res.end();
    
});

app.get('/fact', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'}); 
    console.log("get for fact");
    var n=req.param("n");
    if(n<0 || n==undefined || n==""){
        res.write("Seed value can't be less than 0 (negative) or undefined");
    }
    else{
        res.write("The factorial for "+ n+ " is "+calculator.computeFactorial(n));
    }
    res.end();
});
*/

//Specifies the port number to run on 8080. 
app.listen(8080, function () {
  console.log('Listening on port 8080!')
})
