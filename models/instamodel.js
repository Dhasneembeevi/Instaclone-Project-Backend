const mongoose = require('mongoose');

const instaSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    address: {
        type:String,
        require: true
    },
    image_file:{
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true
    }
})
// Insta - collection name seen in db
module.exports = { Insta: mongoose.model("Insta", instaSchema)};