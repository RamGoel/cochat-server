const { Mongoose, mongo, default: mongoose } = require("mongoose");
mongoose.models={}
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique:'Email Already Exists'
    },
    image:{
        type: String,
        required:true
    }
})

exports.userModel=new mongoose.model('users', userSchema)