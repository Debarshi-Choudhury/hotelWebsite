var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var multer = require('multer');
var flash = require('connect-flash');

var db = require('monk')('localhost/my_hotel');

var index = require('./routes/index');
var users = require('./routes/users');
var contact = require('./routes/contact');
var facilities = require('./routes/facilities');
var our_resort = require('./routes/our_resort');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//handle file uploads
var multer = require('multer');
var upload = multer({dest:'./uploads'});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
	secret:'secret',
	saveUninitialized: true,
	resave:true
}));

app.use(passport.initialize());
app.use(passport.session());

//Validator
app.use(expressValidator({
	errorFormatter: function(param,msg,value){
		var namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;

		while(namespace.length){
			formParam += '[' + namespace.shift + ']';
		}
		return{
			param : formParam,
			msg : msg,
			value : value
		};
	}
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(function(req,res,next){
	res.locals.messages = require('express-messages')(req,res);
	next();
});

app.get('*',function(req,res,next){
	res.locals.user = req.user || null;
	next();
});

app.use(function(req,res,next){
	req.db = db;
	next();
});


app.get('/',function(req,res){
	res.render('index',{
		title: "RiuGa's Hotel",
		started: new Date().getFullYear()
	});
});

app.use('/users', users);
app.use('/contact',contact);
app.use('/our_resort',our_resort);
app.use('/facilities',facilities);



/*
app.get('/contact', function(req, res) {
	res.render('contact');
});
*/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
