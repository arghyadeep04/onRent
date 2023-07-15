const basejoi=require('joi')
const Errs=require('./Utils/errors')
const sanitizeHtml =require('sanitize-html');
const joi=basejoi.extend((joi) => ({
    base: joi.string(),
    type: 'string',
    messages:{
        'string.escapeHTML':'Cant send html through forms'
    },
    // language: {
    //     adult: 'needs to be an adult',
    //     cool: 'needs to be cool'
    // },
rules:{ 
        escapeHTML:{
            validate(value, helpers) {

                if (value!=sanitizeHtml(value)) {
                    // Generate an error, state and options need to be passed
                    return helpers.error('string.escapeHTML',{value});
                }

                return sanitizeHtml(value); // Everything is OK
            }
        }
}
}))
const prodscheme=joi.object({
    id:joi.string().escapeHTML(),
    Name:joi.string().required().min(5).max(50).escapeHTML(),
    Place:joi.string().required().min(5).max(50).escapeHTML(),
    Price:joi.number().max(10000).min(0).required(),
    Basis:joi.string().required().escapeHTML(),
    Desc:joi.string().max(10000).required().escapeHTML(),
    // Image:joi.required(),
    Catagory:joi.string().required(),
    Available:joi.string(),
    Availableafter:joi.string().allow(null).allow('')
    // Owner:joi.string().required().escapeHTML(),
    // delete:joi.array()
})

const revscheme=joi.object({
    Username:joi.string().required().escapeHTML().min(3).max(20),
    Rating:joi.number().required().min(1).max(5).integer(),
    Body:joi.string().min(0).escapeHTML(),
    Product:joi.string().escapeHTML()
})

const bookscheme=joi.object({
    Item:joi.string().required().escapeHTML(),
    Bookfrom:joi.required(),
    Bookto:joi.required(),
    Custmessage:joi.string().empty().allow('').allow(null)
})

const userscheme=joi.object({
    username:joi.string().required().escapeHTML(),
    Email:joi.string().email().required().escapeHTML(),
    password:joi.string().required(),
    Phno:joi.number().integer().required().min(1000000000).max(9999999999),
    EmailOtp:joi.number()
    // Photo:joi.required()
})

const valid=(scheme,entry,next)=>{
    const valid=scheme.validate(entry)
    if (valid.error) {
        throw new Errs.AppErrors(400,valid.error)
    } else {
        next()
    }
}

module.exports={prodscheme,revscheme,valid,bookscheme,userscheme}