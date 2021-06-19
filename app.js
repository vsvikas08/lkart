var express 				= require('express'),
	bodyParser 				= require('body-parser'),
	mongoose 				= require('mongoose'),
	passport 				= require('passport'),
	LocalStrategy 			= require('passport-local'),
	passportLocalMongoose 	= require('passport-local-mongoose'),
	bcrypt 					= require('bcryptjs'),
	flash 					= require('connect-flash'),
	User 					= require('./models/user');

mongoose.connect('mongodb://localhost:27017/lkart',{useNewUrlParser:true,useUnifiedTopology:true});
mongoose.set('useCreateIndex', true);
var app = express();

// passport config
require('./config/passport')(passport);

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:false}));
app.use(require('express-session')({
	secret : "Lkart",
	resave : true,
	saveUninitialized : true
}));

// passport middleware : after express session
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());
app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
})

// Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
app.use('/',require('./routes/order'));




app.listen(8080,function(req,res){
	console.log("Server started.....");
})
