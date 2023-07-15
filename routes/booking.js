const exp=require('express')
const bookRouter=exp.Router()
const auths=require('../auths')
const products=require('../models/products')
const bookings=require('../models/bookings')
const { valid, bookscheme } = require('../validation')
const { emailSender } = require('../mailer')
bookRouter.get('/bookproduct:id',auths.checkAuth,(req,res,next)=>{
    products.findById(req.params.id).then(prod=>{

        res.render('bookprodform',{prod})
    })
})

bookRouter.post('/book',auths.checkAuth,(req,res,next)=>{valid(bookscheme,req.body.book,next)},(req,res)=>{
    let inp=req.body.book
    inp.Status='Pending',
    inp.Customer=req.user._id
    inp.Bookfrom=inp.Bookfrom.split('T').join(' ')
    inp.Bookto=inp.Bookto.split('T').join(' ')
    inp.Reqdate=Date.now()
    bookings.insertMany([inp]).then(async val=>{
        console.log(val)
        let prod=await products.findById(inp.Item).populate('Owner')
        let info=await emailSender(prod.Owner.Email,'New booking request for your product',`<b>${req.user.username}</b> has requested for booking of your product <b>${prod.Name}</b><br>Please visit <b>My Inventory</b> on our website to know more`)
        console.log(info);
        req.flash('feedback','Your Booking request was registered successfully')
        req.flash('type','green')
        res.redirect('/products/index')
    })
    // res.send(inp)

})

bookRouter.get('/mybookings',auths.checkAuth,(req,res)=>{
    bookings.find({Customer:req.user._id}).populate('Item').then(books=>{
        res.render('bookings',{books})
    })
})

bookRouter.get('/reqfor:pid',auths.checkAuth,(req,res)=>{
    bookings.find({Item:req.params.pid}).populate('Item').populate('Customer').then(books=>{
        res.render('bookme',{books})
    })
})

bookRouter.get('/reply:id',(req,res)=>{
    bookings.findById(req.params.id).then(async book=>{
       const owid= await book.ownerid
       console.log(owid) 
        if(auths.isOwner(owid,req)){
            res.render('bookreplyform',{book})
        }else{
            req.flash('feedback','You must be logged in as Owner of this product')
            req.flash('type','error')
            res.redirect('/users/loginform')
        }

    })
})
bookRouter.post('/reply',(req,res)=>{
    bookings.findById(req.body.book.id).populate('Customer').populate('Item').then(async book=>{
        const owid= await book.ownerid
        console.log(owid) 
         if(auths.isOwner(owid,req)){
            //  res.render('bookreplyform',{book})
            let mybook=req.body.book
            if(mybook.Status=='Refused'){
                mybook.Finalamt=0
            }
            if (req.body.Down) {
                await products.findByIdAndUpdate(book.Item,{...req.body.product,Available:false})
            }
            book.Status=mybook.Status
            book.Message=mybook.Message
            book.Finalamt=mybook.Finalamt
            book.save().then(async val=>{
                console.log(val)
                let info=await emailSender(book.Customer.Email,'Reply to your booking request',`Your booking for <b>${book.Item.Name}</b> got <b>${book.Status}</b><br>Visit our website and then to <b>My Bookings</b> to know more`)
                console.log(info);
                req.flash('feedback','Your reply was delivered Successfully')
                req.flash('type','green')
                res.redirect('/products/index')

            })
         }else{
             req.flash('feedback','You must be logged in as Owner of this product')
             req.flash('type','error')
             res.redirect('/users/loginform')
         }
 
     })
})
module.exports=bookRouter