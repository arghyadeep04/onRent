const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
    api_key:process.env.CLOUDINARY_APIKEY,
    api_secret:process.env.CLOUDINARY_SECRET,
    cloud_name:process.env.CLOUDINARY_CLOUDNAME
})

const storage=new CloudinaryStorage({
    cloudinary,
    params:{
    folder:'onrent',
    allowedFormats:['jpeg','jpg','png','webp','avif']}
})

module.exports={cloudinary,storage}