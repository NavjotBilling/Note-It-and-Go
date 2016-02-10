var Todo = require('./models/todo');
var path = require('path');
module.exports = function(app, passport) {


    /* Homepage */

    app.get('/', function(req, res) {
    res.render('index.ejs');

    });


    /* Show the login form */
    app.get('/login', function(req, res) {


        res.render('login.ejs', { message: req.flash('loginMessage') });
    });



    /* Show the sign up form*/

    app.get('/signup', function(req, res) {


        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });




    /* Profile*/

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    /*  Logout */

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    /* Signup */

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    /* Login */

    app.post('/login', passport.authenticate('local-login', {
       successRedirect : '/profile',
       failureRedirect : '/login',
       failureFlash : true 
     }));


        /* Authorization from google */

       app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

       app.get('/auth/google/callback', passport.authenticate('google', {
           successRedirect : '/profile',
           failureRedirect : '/'
         }));



         app.get('/connect/local', function(req, res) {
               res.render('connect-local.ejs', { message: req.flash('loginMessage') });
           });
           app.post('/connect/local', passport.authenticate('local-signup', {
               successRedirect : '/profile',
               failureRedirect : '/connect/local',
               failureFlash : true
           }));



           // callback

           app.get('/connect/google/callback',
               passport.authorize('google', {
                   successRedirect : '/profile',
                   failureRedirect : '/'
               }));

          // unlink the google account

       app.get('/unlink/google', function(req, res) {
           var user          = req.user;
           user.google.token = undefined;
           user.save(function(err) {
              res.redirect('/profile');
           });
       });


       app.get('/api/todos', function (req, res) {
           getTodos(res);
       });

       app.post('/api/todos', function (req, res) {

           /* Todo create function */
           Todo.create({
               text: req.body.text,
               done: false
           }, function (err, todo) {
               if (err)
                   res.send(err);

               getTodos(res);
           });

       });

       // deleting the todo
       app.delete('/api/todos/:todo_id', function (req, res) {
           Todo.remove({
               _id: req.params.todo_id
           }, function (err, todo) {
               if (err)
                   res.send(err);

               getTodos(res);
           });
       });

     // load the file

     app.get('*', function (req, res) {
       res.render(path.resolve(__dirname + '/../views/profile.ejs'));
     });
};

  /* error handling*/
function getTodos(res) {
    Todo.find(function (err, todos) {
        if (err) {
            res.send(err);
        }

// returns todo in JSON format
        res.json(todos);
    });
};

// if user is logged in process otherwise redirect them back to homepage
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');

}
