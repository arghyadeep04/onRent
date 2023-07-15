if (process.env.NODE_ENV !=="production") {
    require('dotenv').config()
}

// const mapToken=process.env.MAPBOX_TOKEN
// const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding')
// const geocoder=mbxGeocoding({accessToken:mapToken})
// geocoder.forwardGeocode({
//     query: 'Paris, France',
//     limit: 1
//   })
//     .send().then(data=>{
//         console.log(data.body.features[0].geometry)
//     })
console.log(process.env.SAMPLE)
const exp=require('express')
const path=require('path')
const methodover=require("method-override")
const morgan=require('morgan')
const joi=require('joi')
const app=exp();
app.use(methodover("_method"))
app.use(exp.static(path.join(__dirname,"public")))
app.use("/static",exp.static('public'))
app.use(exp.urlencoded({extended:true}))
app.use(exp.json())
app.use(morgan('dev'))
app.set("view engine",'ejs');
app.set('views',path.join(__dirname,'/views'))
const mongoose = require('mongoose');
// const campgrounds=require('./models/campgrounds')
// const reviews=require('./models/reviews')
const Errs=require('./Utils/errors')
const productsRout=require('./routes/products')
const bookRout=require('./routes/booking')
const userRout=require('./routes/user')
const revrout=require('./routes/reviews')

// const {inpscheme,revscheme}=require('./validation')
const parser=require('cookie-parser')
app.use(parser())
const session=require('express-session')
const MongoStore=require('connect-mongo')
const store=MongoStore.create({
    mongoUrl:'mongodb://127.0.0.1:27017/onrent',
    secret:'yelp',
    touchAfter:24*60*60
})
store.on('error',e=>{
    console.log('mongoStore error',e)
})
app.use(session({
    store,
    secret:'onstore',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+60*60000,
        maxAge:60*60000,
        secure:false
    }
}))
const User = require('./models/user')
const products = require('./models/products')
const passport=require('passport')
const passLoc=require('passport-local')
app.use(passport.initialize())
app.use(passport.session())
passport.use(new passLoc(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
const flash=require('connect-flash')
app.use(flash())
const helmet=require('helmet')
const demRouter = require('./routes/demands')
const quesRouter = require('./routes/questions')
const verRouter = require('./routes/verification')
app.use(helmet({contentSecurityPolicy:false}))
// 
// process.env.ATLAS_URL
mongoose.connect('mongodb://127.0.0.1:27017/onstore')
.then(()=>{
    console.log("connected")
})
.catch(err=>{
    console.log("Connection Error :",err)
})

app.get('/',(req,res)=>{
    res.render('home.ejs',{logdin:req.isAuthenticated()})
})
app.use('/users',userRout)
app.use('/products',productsRout)
app.use('/bookings',bookRout)
app.use('/demands',demRouter)
app.use('/review',revrout)
app.use('/questions',quesRouter)
app.use('/verification',verRouter)
app.all("*",(req,res,next)=>{
    throw new Errs.AppErrors(404,"Not Found")
})

app.use((err,req,res,next)=>{
    const {status=500,message="Something Went Wrong"}=err
    res.status(status).render('error',{err})
})

app.listen(80,process.env.PHONE_IP||"localhost",()=>{
    console.log("http:/localhost:80")
})