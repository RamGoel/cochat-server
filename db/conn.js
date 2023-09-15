const mongoose = require('mongoose');

const connectToDB = () => {
    mongoose.connect(process.env.MONGO_URI).then(res => {
        console.log("Connected to MONGO")
    }).catch(err => {
        console.log("Error Connecting to MONGO")
    })
}

exports.connect=connectToDB