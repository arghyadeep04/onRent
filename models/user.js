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
    Stared:[{type:mongoose.Schema.Types.ObjectId,ref:'Products'}],
    Place:String,
geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      // required: true
    },
    coordinates: {
      type: [Number],
      // required: true
    }
  },
})
userSchma.plugin(passport)
const User=mongoose.model('User',userSchma)
module.exports=User