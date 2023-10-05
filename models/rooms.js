const { Mongoose, mongo, default: mongoose } = require("mongoose");

const roomSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    members: {
        type: Array,
        required: true,
    },
    icon:{
        type: String,
        required:true
    }
})

exports.roomModel=new mongoose.model('rooms', roomSchema)