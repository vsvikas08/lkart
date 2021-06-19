var mongoose = require("mongoose");
var orderSchema = new mongoose.Schema({
	fname : String,
	lname : String,
	email : String,
	laundry: String,
	dryclean: String,
	iron: String,
	phone: String,
	address: String,
	status: String
});
module.exports = mongoose.model("Order",orderSchema);
