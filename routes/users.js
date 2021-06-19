const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User registration model
const User = require('../models/user')

// login page
router.get('/login',function(req,res){
  res.render('login');
})

// Register Page
router.get('/register',function(req,res){
  res.render("register");
});

// Register Handle
router.post('/register',function(req,res){
  const {firstName,lastName,email,phone,password} = req.body;
  let errors = [];

  // check required fields
  if(!firstName || !lastName || !email || !phone || !password){
    errors.push({msg: 'Please fill all the fields'});
  }

  // Check passwords match
  // for future

  // check password at least 6 characters
  if(password.length < 6){
    errors.push({msg: 'Password should be at least 6 characters'});
  }
  console.log(req.body);
  if(errors.length > 0){
    res.render('register',{
      errors,
      firstName,
      lastName,
      email,
      phone
    })
  }else{
    // validation passed now we can insert in db
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          firstName,
          lastName,
          email,
          phone
        });
      } else {
        var newUser = new User({
          firstName,
          lastName,
          email,
          phone,
          password
        });
        
        // encrypt password
        bcrypt.genSalt(10,function(err,salt){
          bcrypt.hash(newUser.password,salt,function(err,hash){
            if(err) throw err;
            newUser.password = hash;

            // save user
            newUser.save()
              .then(user => {
                req.flash('success_msg','You are successfully registered');
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }

});


// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});


module.exports = router;




// var express = require('express');
// var router = express.Router();
// var bcrypt = require('bcryptjs');
// var passport = require('passport');
// // Load User model
// var User = require('../models/user');
// var { forwardAuthenticated } = require('../config/auth');

// // Login Page
// router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// // Register Page
// router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// // Register
// router.post('/register', (req, res) => {
//   var { firstName, lastName, email, phone, password } = req.body;
//   let errors = [];

//   if (!firstName || !lastName || !email || !phone) {
//     errors.push({ msg: 'Please enter all fields' });
//   }

//   // if (password != password2) {
//   //   errors.push({ msg: 'Passwords do not match' });
//   // }

//   if (password.length < 6) {
//     errors.push({ msg: 'Password must be at least 6 characters' });
//   }

//   if (errors.length > 0) {
//     res.render('register', {
//       errors,
//       firstName,
//       lastName,
//       email,
//       phone
//     });
//   } else {
//     User.findOne({ email: email }).then(user => {
//       if (user) {
//         errors.push({ msg: 'Email already exists' });
//         res.render('register', {
//           errors,
//           firstName,
//           lastName,
//           email,
//           phone
//         });
//       } else {
//         var newUser = new User({
//           firstName,
//           lastName,
//           email,
//           phone,
//           password
//         });

//         bcrypt.genSalt(10, (err, salt) => {
//           bcrypt.hash(newUser.password, salt, (err, hash) => {
//             if (err) throw err;
//             newUser.password = hash;
//             newUser
//               .save()
//               .then(user => {
//                 req.flash(
//                   'success_msg',
//                   'You are now registered and can log in'
//                 );
//                 res.redirect('/login');
//               })
//               .catch(err => console.log(err));
//           });
//         });
//       }
//     });
//   }
// });

// // Login
// router.post('/login', (req, res, next) => {
//   passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true
//   })(req, res, next);
// });

// // Logout
// router.get('/logout', (req, res) => {
//   req.logout();
//   req.flash('success_msg', 'You are logged out');
//   res.redirect('/login');
// });

// module.exports = router;