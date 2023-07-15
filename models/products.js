const mongoose=require("mongoose")
const prodschema= new mongoose.Schema({
  Lasteditedon:Date,
  Available:Boolean,
  Availableafter:Date,
   Name:String,
   Desc:String,
   Price:Number,
   Basis:{
    type:String,
    enum:['Day','Hour','Week','Month','Year'],
    required:true
   },
   Thumbnail:
    {
        filename:String,
        originalname:String,
        path:String
    }
   ,
   Images:[{
    filename:String,
    originalname:String,
    path:String
}],
Catagory:{
  type:String,
  enum:['Electronics','Toys','Furniture','Property','Accessories','Tools','Miscllaneous','Electrical']
},
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
  Owner:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  Reviews:[{type:mongoose.Schema.Types.ObjectId,ref:'Reviews'}],
},{toJSON:{virtuals:true}})


const products=mongoose.model('Products',prodschema)
module.exports=products