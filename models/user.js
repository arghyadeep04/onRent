const passport=require('passport-local-mongoose')
const mongoose=require("mongoose")
const userSchma= new mongoose.Schema({
    Email:{type:String,required:true},
    Phno:Number,
    Photo:{
        filename:String,
        originalname:String,
        path:String
    },
    Products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Products'
    }],
    Stared:[{type:mongoose.Schema.Types.ObjectId,ref:'Products'}]
})
userSchma.plugin(passport)
const User=mongoose.model('User',userSchma)
module.exports=User