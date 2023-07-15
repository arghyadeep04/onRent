const exp=require('express')
const { checkAuth, isOwner } = require('../auths')
const revRouter=exp.Router()
const review=require('../models/reviews')
const products = require('../models/products')
const { valid, revscheme } = require('../validation')
revRouter.post('/addreview',(req,res,next)=>{valid(revscheme,req.body,next)},checkAuth,async (req,res)=>{
    let inp=req.body
    inp.Username=req.user.username
    inp.User=req.user._id
    inp.Date=Date.now()
    inp.Userphoto=req.user.Photo.path
    let myrev=new review(inp)
    let prod=await products.findById(inp.Product)
    if(!prod.Reviews){
        prod.Reviews=[]
    }
    prod.Reviews.push(myrev._id)
    let test=await Promise.all([prod.save(),myrev.save()])
    console.log(test)
    req.flash('feedback','Your review was added successfully')
    req.flash('type','green')
    res.redirect(`/products/view${inp.Product}`)
})

revRouter.delete("/deletereview",async(req,res)=>{
    const {revid,grdid}=req.body
    let owid=await review.findById(revid)
    if(isOwner(owid.User,req)){
    await Promise.all([
        review.findByIdAndRemove(revid),
        products.findByIdAndUpdate(grdid,{$pull:{Reviews:revid}})
    ])
    req.flash('feedback','Review Successfully Deleted')
    req.flash('type','success')
    res.redirect(`/products/view${grdid}`)}
    else{
        req.flash('feedback','You dont have permisson to do that')
        req.flash('type','error')
        res.redirect(`/products/view${grdid}`)}  
    
})

module.exports=revRouter