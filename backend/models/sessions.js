const mongoose = require('mongoose');

const sessionSchema=new mongoose.Schema({
    type:String,
    duration:Number,
    date:String,
    notes:String,
})
module.exports=mongoose.model("Session", sessionSchema);