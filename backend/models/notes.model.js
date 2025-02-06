const mongoose = require("mongoose")

const Schema = mongoose.Schema

const noteSchema = new Schema({
    title : {type: String, required: true},
    content:  {type: String, required : true},
    image : {type: String, default: ""},
    audio : {type: String, default: ""}, // Added audio field to support audio uploads
    isFavourite : {type: Boolean, default: false},
    userId : {type: String, required : true},
    createdOn : {type: Date, default: new Date().getTime()}
})

module.exports = mongoose.model("Note", noteSchema)