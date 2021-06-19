const express = require('express');
const router = express.Router();
const passport = require('passport');
const Order = require('../models/order');

router.get("/order",isLoggedIn,function(req,res){
	res.render("order");
});
router.post("/order",(req,res)=>{
	var fname = req.body.fname;
	var lname = req.body.lname;
	var email = req.body.email;
	var phone = req.body.phone;
	var address = req.body.address;
	var laundry = req.body.laundry;
	var dryclean = req.body.dryclean;
	var iron = req.body.iron;
	var status = "Placed";
	var newOrder = {fname: fname,lname: lname,email: email,
						laundry: laundry, dryclean: dryclean,iron: iron,
						phone: phone, address: address,status: status};
	console.log(newOrder);
	if(laundry==0 && dryclean==0){
		
		res.redirect('/order')
	}
	Order.create(newOrder,function(err,newlyCreated){
		if(err){
			console.log(err);
		}else{
			// redirect back to campgrounds page
			res.redirect("/myorder");
		}
	});

})

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/users/login")
}



module.exports = router;