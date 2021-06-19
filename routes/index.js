const express = require('express');
const router = express.Router();
var Orders = require('../models/order')

// const { ensureAuthenticated } = require('../config/auth');

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next(); // if user login go next
	}
	req.flash('error','Please login first');
	res.redirect("/users/login");
}

router.get('/',function(req,res){
	// console.log(req.user);
	// console.log(req.user);
	res.render("index");
})
router.get('/myorder', isLoggedIn,function(req,res){
	Orders.find({},function(err,allOrders){
		if(err){
			console.log(err);
		}else{
			res.render("myorder",{orders:allOrders});
		}
	});

})

module.exports = router;
