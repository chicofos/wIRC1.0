var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var expressLayouts = require('express-ejs-layouts');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var configDB = require('./config/database.js');


//connect to our database
mongoose.connect(configDB.url);

// pass passport for configuration
require('./config/passport')(passport); 

//template
app.set('view engine', 'ejs'); 
app.set('layout', 'layout') 

app.set('views', __dirname + '/public/views');


//set our express application
app.use(morgan('dev')); //log every request to the console
app.use(cookieParser()); //read cookies (for auth)
app.use(bodyParser()); //get information from html forms
app.use(expressLayouts); //use multiple layouts

//sessions
app.use(session({
    secret: 'a4f8071f-c873-4447-8ee2',
    cookie: { maxAge: 2628000000 },
    store: new (require('express-sessions'))({
        storage: 'mongodb',
        instance: mongoose, // optional
        host: 'localhost', // optional
        port: 27017, // optional
        db: 'test', // optional
        collection: 'sessions', // optional
        expire: 86400 // optional
    })
}));

app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions
app.use(flash()); //for flash messages stored in session

app.use(express.static(__dirname + '/public'));

//routes module
require('./src/js/routes')(app,passport);
 
//listen app
app.listen(port);
console.log('The magic happens on port ' + port);