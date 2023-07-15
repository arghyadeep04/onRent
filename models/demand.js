const mongoose=require("mongoose")
const demSchma= new mongoose.Schema({
 User:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
 Type:String,
 Desc:String,
 Date:Date,
 Answers:[{
   user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    product:{type:mongoose.Schema.Types.ObjectId,ref:'Products'},
    message:String,
    date:Date
 }]
})
// userSchma.plugin(passport)

// demSchma.virtual()

const Demand=mongoose.model('Demand',demSchma)
module.exports=Demand