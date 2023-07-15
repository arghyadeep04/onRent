// const passport=require('passport-local-mongoose')
const mongoose=require("mongoose")
const reviewSchma= new mongoose.Schema({
    Userphoto:String,
    Username:String,
    User:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    Type:{type:String,enum:['comment','reply']},
    Replyto:{type:mongoose.Schema.Types.ObjectId,ref:'Reviews'},
    Body:String,
    Rating:Number,
    Product:{type:mongoose.Schema.Types.ObjectId,ref:'Products'},
    Date:Date
},{toJSON:{virtuals:true}})
// userSchma.plugin(passport)
reviewSchma.virtual('userphoto').get(async function(){
    this.populate('User').then(val=>{
        console.log(val.User.Photo.path)
        return val.User.Photo.path
    })
    

})
const Reviews=mongoose.model('Reviews',reviewSchma)
module.exports=Reviews