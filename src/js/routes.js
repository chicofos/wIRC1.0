module.exports = function(app){


    //Home page
    app.get('/', function(req, res){
        res.render('home'); //load the home.ejs file
    });

    //Home page
    app.get('/layout2', function(req, res){
        res.render('home', { layout: 'layout2' }); //load the home.ejs file with layout 2
    });

};



