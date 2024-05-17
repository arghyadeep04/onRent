const exp=require('express')
const userRouter=exp.Router()
const User=require('../models/user')
const passport=require('passport')
const multer  = require('multer')
const {storage}=require('../cloudinary/index')
const { checkAuth } = require('../Utils/auths')
const { valid, userscheme } = require('../Utils/validation')
const upload = multer({ storage })
const bcrypt=require('bcrypt')
const { AppErrors } = require('../Utils/errors')
const mapToken=process.env.MAPBOX_TOKEN
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding')
const { distKm } = require('../Utils/geograph')
const geocoder=mbxGeocoding({accessToken:mapToken})
userRouter.get('/registerform',(req,res)=>{
    res.render('regform',{message:req.flash('feedback'),type:req.flash('type'),logdin:req.isAuthenticated()})
})



userRouter.post('/register',upload.single('Photo'),(req,res,next)=>{valid(userscheme,req.body,next)},async (req,res)=>{
    console.log(req.session)
    let resultemail=0;let resultphone=1
    try {
         resultemail=await bcrypt.compare(req.body.EmailOtp, req.session.otps[req.body.Email])
        console.log(req.body.Phno,req.session.otps,req.body.PhoneOtp)
         resultphone=await bcrypt.compare(req.body.PhoneOtp, req.session.otps[req.body.Phno]) 
    } catch (error) {
       console.log("Otp Error",error) 
    }
  
    console.log("results...",resultemail,resultphone)
        console.log('InHouse',req.session)
        if(resultemail && resultphone){
            delete req.session.otps[req.body.Phno];
            delete req.session.otps[req.body.Email];

            req.session.save()
            try{
                let {Email,username,password,Phno,Place}=req.body
                const file=req.file
                let geometry=await geocoder.forwardGeocode({
                    query: Place,
                    limit: 1
                  })
                    .send()
                    // console.log(location)
                    geometry=geometry.body.features[0].geometry
                const Photo={
                    originalname:file.originalname,
                    filname:file.filename,
                    path:file.path
                }
                let newuser=await User.register(new User({Email,username,Photo,Phno,Place,geometry}),password)
                req.login(newuser,err=>{
            
                    req.flash('feedback','Successfully added and logged in')
                    req.flash('type','success')
                    // let topath=req.session.requestedFor||'/users/registerform'
                    // req.session.requestedFor=null
                    res.redirect('/products/index')
                })
            }catch(e){
                console.log("Reg Error",e)
                req.flash('feedback',e.message)
                req.flash('type','danger')
                res.redirect('/users/registerform')
            }
        }else{
            delete req.session.otps[req.body.Phno];
            delete req.session.otps[req.body.Email];
            req.session.save()
            req.flash('feedback','Incorrect OTP')
            req.flash('type','danger')
            res.redirect('/users/registerform')
            // throw new AppErrors(404,"OTP incorrect")
        }
    });




userRouter.get('/loginform',(req,res)=>{
    res.render('logform',{message:`${req.flash('feedback')}${req.flash('error')}`,type:'danger',logdin:req.isAuthenticated()})
})
userRouter.post('/login',passport.authenticate('local',{failureFlash:"Username or Password is incorrect",failureRedirect:'/users/loginform'}),(req,res)=>{
    req.flash('feedback','Logged in')
    req.flash('type','green')
    // let topath=req.session.requestedFor||'/users/loginform'
    // req.session.requestedFor=null
    res.redirect('/products/index')
})

userRouter.get('/logout',(req,res)=>{
    req.logout((err)=>{
    req.flash('feedback','Successfully Logged out')
    req.flash('type','green')
    let topath=req.session.requestedFor||'/users/loginform'
        req.session.requestedFor=null
        res.redirect(topath)
})
})

userRouter.get('/view:id',(req,res)=>{
    User.findById(req.params.id).then(user=>{
        res.render('profile',{user,logdin:req.isAuthenticated()})
    })
})

userRouter.get('/addfav:prodid',checkAuth,(req,res)=>{
    User.findById(req.user._id).then(user=>{
        if (user.Stared.indexOf(req.params.prodid)==-1) {
            
            user.Stared.push(req.params.prodid)
            user.save().then(val=>{
                console.log(val)
                res.send('done')
            })
        }else{
            console.log('alredy')
            res.send('alredy')
        }
    })
})

userRouter.get('/removefav:id',checkAuth,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$pull:{Stared:req.params.id}}).then(val=>{
        res.send(val)
    })
})

module.exports=userRouter