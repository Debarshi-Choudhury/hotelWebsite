var mongoose = require('mongoose');
var db = mongoose.connection;
var bcrypt = require('bcrypt');


mongoose.connect('mongodb://localhost/my_hotel');

//User schema
var UserSchema = mongoose.Schema({
	username:{
		type: String,
		index: true
	},
	password:{
		type: String,
		required:true,
		bcrypt:true
	},
	email:{
		type:String
	},
	name:{
		type:String
	}
});

var User = module.exports = mongoose.model('User',UserSchema);

module.exports.comparePassword = function(candidatePassword,hash,callback){
	bcrypt.compare(candidatePassword,hash,function(err,isMatch){
		if(err) throw err;
		callback(null,isMatch);
	});
}

module.exports.getUserById = function(id,callback){
	User.findById(id,callback);
}

module.exports.getUserByUsername = function(u_name,callback){
	var query = {username:u_name};
	User.findOne(query,callback);
}

module.exports.createUser = function(newUser,callback){
	bcrypt.hash(newUser.password,10,function(err,hash){
		if(err) throw err;
		newUser.password = hash;
		newUser.save(callback);
	});
}
