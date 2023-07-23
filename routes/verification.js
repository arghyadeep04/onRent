const exp=require('express');
const { emailSender } = require('../Utils/mailer');
const verRouter=exp.Router()
const bcrypt=require('bcrypt');
const { sendMsg } = require('../Utils/messeger');
verRouter.get('/email:email',async (req,res)=>{
    let otp=Math.ceil(1000+Math.random()*9000);
    bcrypt.genSalt(2, function(err, salt) {
        bcrypt.hash(String(otp), salt, async function(err, hash) {
            // console.log('hash',hash)
            if(req.session.emailotp==undefined){
                req.session.emailotp={}
            }
            req.session.emailotp[req.params.email]=hash;
            req.session.save()
            setTimeout(() => {
                delete req.session.emailotp[req.params.email];
                req.session.save()
            }, 120000);
            console.log("OTP",req.session)
            // Store hash in your password DB.
        });
    });
    let info=await emailSender(req.params.email,'OTP',`Your OTP for registration is ${otp}`);
    // console.log("OTP",req.session.otp)
    console.log(info);
    res.send("Email Sent")
})

verRouter.get('/phone:number',async (req,res)=>{
    let otp=Math.ceil(1000+Math.random()*9000);
    bcrypt.genSalt(2, function(err, salt) {
        bcrypt.hash(String(otp), salt, async function(err, hash) {
            // console.log('hash',hash)
            if(req.session.emailotp==undefined){
                req.session.emailotp={};
            }
            req.session.emailotp[req.params.number]=hash
            req.session.save()
            setTimeout(() => {
                delete req.session.emailotp[req.params.number];
                req.session.save()
            }, 120000);
            console.log("OTP",req.session)
            // Store hash in your password DB.
        });
    });
    // let info=await sendMsg(req.params.number,otp);
    // console.log("OTP",req.session.otp)
    // console.log(`............\n.............\n...............${otp}..............\n.................\n.................`)
    // console.log(info);
    res.send("Sms Sent")
})

verRouter.get('/both/email:email/phone:number',async(req,res)=>{
    let otpemail=Math.ceil(1000+Math.random()*9000);
    let otpphone=Math.ceil(1000+Math.random()*9000);
    let salt=await bcrypt.genSalt(2)
    let hashemail=await bcrypt.hash(String(otpemail), salt)
    let hashphone=await bcrypt.hash(String(otpphone), salt)

            // console.log('hash',hash)
            if(req.session.otps==undefined){
                req.session.otps={}
            }
            req.session.otps[req.params.email]=hashemail;
            req.session.otps[req.params.number]=hashphone;

            req.session.save((err)=>{console.log("saving error",err)})
            setTimeout(() => {
                delete req.session.otps[req.params.email];
                delete req.session.otps[req.params.number];

                req.session.save()
            }, 120000);
            console.log("OTP",req.session)
            // Store hash in your password DB.
       
            
    let info=await emailSender(req.params.email,'OTP',`Your OTP for registration is ${otpemail}`);
    let infom=await sendMsg(req.params.number,otpphone);
    // console.log(`............\n.............\n...............${otpphone}..............\n.................\n.................`)
    console.log("OTP",req.session.otps)
    console.log(info,infom);
    res.send("Email and SMS Sent")
})

module.exports=verRouter