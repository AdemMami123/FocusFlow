const mongoose = require('mongoose');

const projectSchema=new mongoose.Schema({
   name:String,
   beginDate:Date,
   deadline:Date,

})
module.exports=mongoose.model("Project", projectSchema);