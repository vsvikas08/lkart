module.exports = {
	ensureAuthenticated : function(req,res,next){
		if(req.isAuthenticated){
			return next();
		}
		req.flash('error_msg','Please login first');
		res.redirect('/users/login');
	}
	forwardAuthenticated: function(req, res, next) {
    	if (!req.isAuthenticated()) {
      		return next();
    	}
    	res.redirect('/dashboard');      
  	}
}


// function isLoggedIn(req,res,next){
// 	if(req.isAuthenticated()){
// 		return next(); // if user login go next
// 	}
// 	res.redirect("\login");
// }
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Load User Model
var User = require('../models/user');



module.exports = function(passport){
	passport.use(
		new LocalStrategy({usernameField:'email'},(email,password,done)=>{
			// Match User
			User.findOne({email:email})
				.then(user => {
					if(!user){
						return done(null,false,{message:'That email is not registered!'});
					}
					// Match password
					bcrypt.compare(password,user.password,(err,isMatch)=>{
						if(err)
							throw err;
						if(isMatch){
							return done(null,user);
						}else{
							return done(null,false,{message:"Password Incorrect"});
						}
					});
				})
				.catch(err => console.log(err));
		})
	);

	passport.serializeUser(function(user, done) {
  		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
  		User.findById(id, function(err, user) {
    		done(err, user);
  		});
	});
}
