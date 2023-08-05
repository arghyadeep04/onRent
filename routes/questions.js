const exp=require('express')
const { checkAuth, isOwner } = require('../Utils/auths')
// const Demand = require('../models/demand')
const products = require('../models/products')
const Ques = require('../models/questions')
const quesRouter=exp.Router()

quesRouter.get('/askon:prodid',checkAuth,(req,res)=>{
    res.render('askform',{prodid:req.params.prodid,logdin:req.isAuthenticated()})
})

quesRouter.post('/new',checkAuth,(req,res)=>{
    let ques=req.body.ques
    ques.Asker=req.user._id
    Ques.insertMany([ques]).then(val=>{
        req.flash('feedback','Your Question was successfully added')
        req.flash('type','success')
        res.redirect(`/products/view${ques.Product}`)
    })
})

quesRouter.get('/answers:prodid',checkAuth,(req,res)=>{
    Ques.find({Asker:req.user._id,Product:req.params.prodid}).then(qaa=>{
        res.render('questionanswer',{ques:qaa,logdin:req.isAuthenticated()})
    })
})

quesRouter.get('/queson:prodid',checkAuth,(req,res)=>{
    products.findById(req.params.prodid).then(prod=>{
        console.log(req.params.prodid,prod)
        if(isOwner(prod.Owner,req)){
            Ques.find({Product:req.params.prodid}).populate('Asker').then(ques=>{
                res.render('myquestions',{ques,message:req.flash('feeedback'),type:req.flash('type'),logdin:req.isAuthenticated()})
            })
        }else{
            req.flash('feedback','You dont have access to do that')
            req.flash('type','warning')
            res.redirect(`/products/index`)
        }
    })
})

quesRouter.get('/answerq:qid',checkAuth,(req,res)=>{
    Ques.findById(req.params.qid).populate('Product').then(que=>{
        if (isOwner(que.Product.Owner,req)) {
            res.render('qanswerform',{que,logdin:req.isAuthenticated()})
            
        }else{
            req.flash('feedback','You dont have access to do that')
            req.flash('type','red')
            res.redirect(`/products/index`)
        }

    })
})

quesRouter.post('/answer',(req,res)=>{
    Ques.findById(req.body.qid).populate('Product').then(que=>{
        if (isOwner(que.Product.Owner,req)) {
            que.Answer=req.body.Answer
            que.save().then(val=>{
                req.flash('feedback','Successfully answered')
                req.flash('type','green')
                res.redirect(`/questions/queson${que.Product._id}`)
            })
            
        }else{
            req.flash('feedback','You dont have permisson to do that')
            req.flash('type','red')
            res.redirect(`/products/index`,{message:req.flash('feedback'),type:req.flash('type')})
        }
    })
})

module.exports=quesRouter