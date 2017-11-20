//Requires express, fs, and body-parser
const express = require('express')
const app = express()
const fs = require('fs');
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static('public'))
app.use('/static', express.static('public'))

//Specifies the port number to run on 8080. 
app.listen(8080, function () {
  console.log('Listening on port 8080!')
})
