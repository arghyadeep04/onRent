const products=require('../models/products')

const checkAuth=(reqi,res,next)=>{
    let req=reqi
    console.log()
    if (!req.isAuthenticated()) {
        req.flash('error','You must be logged in')
        req.flash('type','danger')
        req.session.requestedFor=req.originalUrl
        res.redirect('/users/loginform')
    }
     else{
        next()
    }
}
// const checkOwner=async(req,res,next)=>{
//     const myreq=req
//     const params=myreq.params
//     const body=myreq.body
//     const user=myreq.user
//     console.log('here',params,body,user)
//     let camp=await products.findById(req.params.id).populate('Owner')
//     if(!(camp)){
//         console.log(req.body.id)
//         camp=await products.findById(req.body.id).populate('Owner')
//     }
//     // console.log(camp)
//     // console.log(camp.Owner._id,user._id,!user,!camp.Owner._id.equals(user._id))
//     if (!user || !camp.Owner._id.equals(user._id)) {
//         req.flash('error',`You must be logged in as ${camp.Owner.username}`)
//         req.flash('type','danger')
//         req.session.requestedFor=req.originalUrl
//         res.redirect('/users/loginform')
//     }
//      else{
//         next()
//     }
// }

const isOwner=(ownerid,req)=>{
    
    if(ownerid.equals(req.user._id)){
        return true
    }else{
        return false
    }
}

module.exports={checkAuth,isOwner}