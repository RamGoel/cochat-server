const { Mongoose, mongo, default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    image:String
})

exports.userModel=new mongoose.model('users', userSchema)