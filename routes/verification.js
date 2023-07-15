const exp=require('express');
const { emailSender } = require('../mailer');
const verRouter=exp.Router()
const bcrypt=require('bcrypt')
verRouter.get('/email:email',async (req,res)=>{
    let otp=Math.ceil(1000+Math.random()*9000);
    bcrypt.genSalt(2, function(err, salt) {
        bcrypt.hash(String(otp), salt, async function(err, hash) {
            // console.log('hash',hash)
            req.session.otp=hash;
            req.session.save()
            setTimeout(() => {
                req.session.otp=undefined;
                req.session.save()
            }, 60000);
            console.log("OTP",req.session)
            // Store hash in your password DB.
        });
    });
    let info=await emailSender(req.params.email,'OTP',`Your OTP for registration is ${otp}`);
    // console.log("OTP",req.session.otp)
    console.log(info);
    res.send("Email Sent")
})

module.exports=verRouter