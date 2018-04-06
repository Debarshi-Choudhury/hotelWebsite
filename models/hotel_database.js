var mongoose = require('mongoose');
var db = mongoose.connection;

mongoose.connect('mongodb://localhost/my_hotel');

//User schema
var hotelSchema = mongoose.Schema({
	hotel_name:{
		type: String,
		index: true
	},
	hotel_location:{
		type: String,
		required:true
	},
	email:{
		type:String,
    required:true
	},
	rooms:{
		type: Number,
		required:true
	},
	cost:{
		type: Number,
		required: true
	},
	pasand:{
		type: Array
	},
	pasand_count:{
		type: Number
	}
});

var Hotel = module.exports = mongoose.model('Hotel',hotelSchema);
