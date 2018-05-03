var mongoose = require("mongoose");

// userSchema.rooms types, should be replaced with RoomSchema
var userSchema = mongoose.Schema({
	id:{
		type:String,
		required:true,
		unique: true
	},
	name: {type: String, required:true},
	nationality: {type: String, required: true},
	sex: {type: String, required: true},
	date_of_birth: {type: Date}
});

userSchema.methods.createUser = function(	id, name,	nationality, sex, date_of_birth){
	this.id = id;
	this.name = name;
	this.nationality = nationality;
	this.sex = sex;
  this.date_of_birth = date_of_birth;
	return this;
}


module.exports = mongoose.model("User", userSchema);
