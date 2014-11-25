var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var expressLayouts = require('express-ejs-layouts');
var morgan = require('morgan');


//template
app.set('view engine', 'ejs'); 
app.set('layout', 'layout') 
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/dist'));

//set our express application
app.use(morgan('dev')); //log every request to the console
app.use(expressLayouts); //use multiple layouts

//routes module
require('./src/js/routes')(app);

//listen app
app.listen(port);
console.log('The magic happens on port ' + port);