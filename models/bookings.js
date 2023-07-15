// const passport=require('passport-local-mongoose')
const mongoose=require("mongoose")
const products=require('../models/products')
const bookSchma= new mongoose.Schema({
    Reqdate:Date,
    Custmessage:String,
    Customer:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    Item:{type:mongoose.Schema.Types.ObjectId,ref:'Products'},
    Bookfrom:Date,
    Bookto:Date,
    Finalamt:Number,
    Status:{type:String,enum:['Aprooved','Refused','Pending']},
    Message:String,
},{toJSON:{virtuals:true}})

bookSchma.virtual('ownerid').get(async function(){
    const prod=await products.findById(this.Item)
    console.log('owid',prod.Owner)
    return prod.Owner
})

// bookSchma.virtual('customerfull').get(async function(){
//     const prod=await products.findById(this.Item)
//     return prod.Owner
// },{toJSON:{virtuals:true}})

// userSchma.plugin(passport)
const Booking=mongoose.model('Booking',bookSchma)
module.exports=Booking