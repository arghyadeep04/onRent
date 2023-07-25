const exp=require('express')
const { checkAuth, isOwner } = require('../Utils/auths')
const Demand = require('../models/demand')
const products = require('../models/products')
const demRouter=exp.Router()

const compare=(a,b)=>{
    return b.Date-a.Date
}

demRouter.get('/demandform',checkAuth,(req,res)=>{
    res.render('demform',{catagories:['Electronics','Toys','Furniture','Property','Accessories','Tools','Miscllaneous','Electrical']})
})

demRouter.post('/demandadd',checkAuth,(req,res)=>{
    inp=req.body.demand
    inp.Date=Date.now()
    inp.User=req.user._id
    Demand.insertMany([inp]).then(val=>{
        console.log(val)
        req.flash('feedback','Demand Successfully added')
        req.flash('type','green')
        res.redirect('/demands/alldemands')
    })
})

demRouter.get('/alldemands',(req,res)=>{
    Demand.find({}).populate('User').then(demands=>{
        demands.sort(compare)
        res.render('alldemands',{demands,logdin:req.isAuthenticated(),message:req.flash('feedback'),type:req.flash('type'),title:'All demands of Users'})
    })
})

demRouter.post('/searchresult',(req,res)=>{
    const {search,Catagory}=req.body;
    let sarchexp=new RegExp(`${search}`,"i");let catagexp=new RegExp(`${Catagory}`,"i")

    Demand.find({Desc:{$regex:sarchexp},Type:{$regex:catagexp}}).populate('User').then(demands=>{
        demands.sort(compare)
        res.render('alldemands',{demands,logdin:req.isAuthenticated(),message:req.flash('feedback'),type:req.flash('type'),title:'Search Results'})
    })
})

demRouter.get('/ansform:id',checkAuth,(req,res)=>{
    products.find({Owner:req.user._id}).then(pds=>{

        res.render('ansform',{demandid:req.params.id,prods:pds})
    })
})

demRouter.get('/mydemands',checkAuth,(req,res)=>{
    Demand.find({User:req.user._id}).populate('User').then(demands=>{
        demands.sort(compare)
        res.render('alldemands',{demands,logdin:req.isAuthenticated(),message:req.flash('feedback'),type:req.flash('type'),title:'Your Demands'})
    })
})

demRouter.post('/addans',checkAuth,async (req,res)=>{
    let id=req.body.demandid
    let ans=req.body.ans
    ans.user=req.user._id
    let dem=await Demand.findById(id)
    ans.date=Date.now()
    dem.Answers.push(ans)
    let fed=await dem.save()
    console.log(fed)
    req.flash('feedback','Your answer was added successfully')
    req.flash('type','green')
    res.redirect(`/demands/answers${id}`)
})

demRouter.get('/answers:id',(req,res)=>{
    Demand.findById(req.params.id).populate('Answers.product').populate('Answers.user').then(demand=>{
        let answers=demand.Answers
        answers.sort(compare)
        res.render('answers',{answers,message:req.flash('feedback'),type:req.flash('type'),demid:req.params.id})
    })
})

module.exports=demRouter