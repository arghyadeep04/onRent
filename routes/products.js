const exp=require('express')
const productRouter=exp.Router()
const multer  = require('multer')
const passport=require('passport')
const {storage, cloudinary}=require('../cloudinary/index')
const upload = multer({ storage })
const products=require('../models/products')
const auths=require('../Utils/auths')
const mapToken=process.env.MAPBOX_TOKEN
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding')
const User = require('../models/user')
const { valid, prodscheme } = require('../Utils/validation')
const geocoder=mbxGeocoding({accessToken:mapToken})
const {distKm}=require('../Utils/geograph')


productRouter.get('/index',(req,res)=>{
    products.find({}).then(products=>{
        res.render('index',{products,logdin:req.isAuthenticated(),title:'All products',message:req.flash('feedback'),type:req.flash('type')})
    })
})

productRouter.get('/addprodform',auths.checkAuth,(req,res)=>{
    res.render('addprodform',{catagories:['Electronics','Toys','Furniture','Property','Accessories','Tools','Miscllaneous','Electrical'],logdin:req.isAuthenticated()})
})

productRouter.get('/view:id',(req,res)=>{
    products.findById(req.params.id).populate('Owner').populate('Reviews').then(val=>{
    
        res.render('oneview',{product:val,message:req.flash('feedback'),type:req.flash('type'),user:req.user?req.user:{username:'anonymous',type:0},logdin:req.isAuthenticated()})
    })
})

productRouter.post('/searchresult',(req,res)=>{
    const {search,Catagory,sortby}=req.body;
    const compare=(a,b)=>{
        // console.log(req.user)
        return distKm(a.geometry.coordinates,req.user.geometry.coordinates)-distKm(b.geometry.coordinates,req.user.geometry.coordinates)
    }
    // console.log(`this.Name.toLowerCase().includes('${search.toLowerCase()}') && this.Catagory.includes('${Catagory}')`) 
    let sarchexp=new RegExp(`${search}`,"i");let catagexp=new RegExp(`${Catagory}`,"i")
    // console.log("<<<<<<<<<<<<<<<<<<<<",sarchexp,catagexp,">>>>>>>>>>>>>>>>>>>>>")
    products.find({Name:{$regex:sarchexp},Catagory:{$regex:catagexp}}).then(products=>{
        console.log(sortby)
        if(sortby=='true' && req.isAuthenticated()){
            // console.log("yes yes")
            products.sort(compare)
        }
        for (let i in products) {
            products[i].Desc=products[i].Desc.replace('\n','<br>');
            
        }
        if(!req.user){
            req.flash('feedback',"We could'nt get your location as you are not logged in")
            req.flash('type','red')
        }
        res.render('index',{products,logdin:req.isAuthenticated(),title:'Your Search Results',message:req.flash('feedback'),type:req.flash('type')})

    })
})

productRouter.post('/addprod',auths.checkAuth,upload.fields([{name: 'Thumbnail', maxCount: 1},
{name: 'Images', maxCount: 10}]),(req,res,next)=>{valid(prodscheme,req.body.product,next)},async (req,res)=>{
    const inp=req.body
   let geometry=await geocoder.forwardGeocode({
    query: inp.product.Place,
    limit: 1
  })
    .send()
    // console.log(location)
    geometry=geometry.body.features[0].geometry
   let Images=req.files.Images.map(ele=>{
    return {
        originalname:ele.originalname,
        path:ele.path,
        filename:ele.filename
    }
   })
   let Thumbnail=req.files.Thumbnail.map(ele=>{
    return {
        originalname:ele.originalname,
        path:ele.path,
        filename:ele.filename
    }
   })[0]
   let myprod=new products({...inp.product,Images,Thumbnail,geometry,Owner:req.user._id,Available:true,Lasteditedon:Date.now()})
   myprod.save().then(val=>{
    console.log(val)
    req.flash('feedback','Your Product was successfully added')
    req.flash('type','success')
    res.redirect(`/products/inventory`)
   })
    // res.send([req.body,req.file,req.files])
})

productRouter.get('/inventory',auths.checkAuth,async(req,res)=>{
    products.find({Owner:req.user._id}).then(pds=>{
        res.render('inventory',{products:pds,logdin:req.isAuthenticated(),message:req.flash('feedback'),type:req.flash('type')})
    })
})

productRouter.get('/edit:id',auths.checkAuth,(req,res)=>{
    products.findById(req.params.id).then(prod=>{
        if (auths.isOwner(prod.Owner,req)) {
            
            res.render('editform',{prod,catagories:['Electronics','Toys','Furniture','Property','Accessories','Tools','Miscllaneous','Electrical'],logdin:req.isAuthenticated()})
        }else{
            req.flash('feedback','You dont have permisson to do that')
            req.flash('type','red')
            res.redirect('/products/index')
        }
    })
})

productRouter.patch('/edit',auths.checkAuth,upload.fields([{name: 'ChangeThumbnail', maxCount: 1},
{name: 'addImages', maxCount: 10}]),(req,res,next)=>{valid(prodscheme,req.body.product,next)},async (req,res)=>{
    console.log('please',req.body)
    let inp=req.body.product
    if (inp.Available=="true") {
        inp.Availableafter=undefined;
    }
    let prod=await products.findById(req.body.prodid)
    if (auths.isOwner(prod.Owner,req)) {
        if(req.body.deleteimg){
        for (let img of req.body.deleteimg) {
            // img=new Map(img)
            console.log('ismap?',img)
            cloudinary.uploader.destroy(img)
            await products.findByIdAndUpdate(req.body.prodid,{$pull:{Images:{filename:img}}})
        }}
        if (req.files.addImages) {
            let newImages=req.files.addImages.map(async ele=>{
                await products.findByIdAndUpdate(req.body.prodid,{$push:{Images:( {
                    originalname:ele.originalname,
                    path:ele.path,
                    filename:ele.filename
                })}})
                // prod.Images.push
                })
        }

        let Thumbnail=[]
        // console.log("///////////////////////////////////////////////////////////////////////",req.files.ChangeThumbnail)
    if((req.files.ChangeThumbnail)){
        let myprod=await products.findById(req.body.prodid)
        await cloudinary.uploader.destroy(myprod.Thumbnail.filename)
        Thumbnail=req.files.ChangeThumbnail.map(ele=>{
        return {
            originalname:ele.originalname,
            path:ele.path,
            filename:ele.filename
        }
        })
        Thumbnail=Thumbnail[0]
        // console.log("..............................................",Thumbnail)
        await products.findByIdAndUpdate(req.body.prodid,{Thumbnail,Lasteditedon:Date.now()})
}
    let final=await products.findByIdAndUpdate(req.body.prodid,inp)
    console.log(final)
    req.flash('feedback','Successfully Updated')
    req.flash('type','success')
    // res.redirect('/products/index')
    res.redirect(`/products/inventory`)
    }else{
        req.flash('feedback','You dont have permisson to do that')
        req.flash('type','red')
        res.redirect('/products/index')
    }
    

})

productRouter.get('/favourites',auths.checkAuth,(req,res)=>{
    User.findById(req.user._id).populate('Stared').then(user=>{

        res.render('favprods',{products:user.Stared,logdin:req.isAuthenticated()})
    })
})



module.exports=productRouter