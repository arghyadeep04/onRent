const mongoose=require("mongoose")
const quesSchma= new mongoose.Schema({
    Asker:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    Product:{type:mongoose.Schema.Types.ObjectId,ref:'Products'},
    Question:String,
    Answer:String
})
// userSchma.plugin(passport)

// demSchma.virtual()

const Ques=mongoose.model('Ques',quesSchma)
module.exports=Ques