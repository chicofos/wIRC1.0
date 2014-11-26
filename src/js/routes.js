module.exports = function(app, passport){


   //Home page
    app.get('/',isLoggedIn, function(req, res){
        res.render('home', {user: req.user }); //load the home.ejs file
    });

    //Home page
    app.get('/login', function(req, res){
        res.render('login', { layout : 'layout-login' }); //load the home.ejs file
    });

    //Profile
    app.get('/profile', isLoggedIn, function(req, res){
        //get the user out of session and pass to template
        res.render('profile', { user : req.user });
    });

     // FACEBOOK ROUTES ======================

    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/',
            failureRedirect : '/'
        }));

    // TWITTER ROUTES ======================
        //TODO


    // GOOGLE ROUTES ======================
        //TODO

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    //Handle Error 404
    app.get('*', function(req, res, next) {
      var err = new Error();
      err.status = 404;
      next(err);
    });

    // handling 404 errors
    app.use(function(err, req, res, next) {
      if(err.status !== 404) {
        return next();
      }
      res.render('404' , {layout : 'layout-login'});
    });

};


//route middleware to make sure a user is logged index
function isLoggedIn(req, res, next){

    //if the user is authenticated in the session, carry on
    if(req.isAuthenticated())
        return next();

    //if they aren't redirect them to the login page
    res.redirect('/login');
}


