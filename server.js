var express = require('express'),
    app = express(),
    port = process.env.PORT || 8080,
    expressLayouts = require('express-ejs-layouts'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    flash = require('connect-flash'),
    configDB = require('./config/database.js'),
    router = express.Router(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

//connect to our database
mongoose.connect(configDB.url);

var chatSchema = mongoose.Schema({
    nick: String,
    msg: String,
    created: {type:Date, default: Date.now}
});

var Chat = mongoose.model('Message', chatSchema);

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
require('./src/js/routes')(app,router,passport);
 
//listen app
server.listen(port);
console.log('The magic happens on port ' + port);


var users = {};

io.sockets.on('connection', function(socket){

    var query = Chat.find({});
    query
    .sort('-created')
    .limit(15).exec(function(err, docs){
        if(err) throw err;
        console.log('sending old msgs');
        socket.emit('load old msgs', docs);
    })

    socket.on('new user', function(data,callback){

        if(data in users)
        {
            callback(false);
        }else{
            socket.nickname = data;
            users[socket.nickname] = socket;
            callback(true);
        }
           
        updateNicknames();
    });

    function updateNicknames(){
        io.sockets.emit('usernames', Object.keys(users));
    }

    socket.on('send message', function(data, callback){
        var msg = data.trim();

        if(msg !== ''){
            var newMsg = new Chat({msg:msg, nick:socket.nickname});
            newMsg.save(function(err){
                if(err) throw err;
                io.sockets.emit('new message', {msg : msg, nick: socket.nickname, date: newMsg.created});
            })
        }


    });

    socket.on('disconnect', function(data){
        if(!socket.nickname) return;
        delete users[socket.nickname];
        updateNicknames();
    });
});