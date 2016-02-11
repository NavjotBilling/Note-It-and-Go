var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var mongoose = require('mongoose');
var methodOverride = require('method-override');

/** connection to the database **/

mongoose.connect('mongodb://navjot:abcxyz123@ds060968.mongolab.com:60968/cloudapp');
// configure the passport

require('./config/passport')(passport);

// setting up the application
app.use(express.static(__dirname + '/views'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


app.use(session({ secret: 'DogsAreCute', saveUninitialized: true, resave: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride('X-HTTP-Method-Override'));

// routes
require('./app/routes.js')(app, passport);

// to launch
app.listen(port);
console.log('Running at : ' + port);
