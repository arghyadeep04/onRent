// if (process.env.NODE_ENV !=="production") {
//     require('dotenv').config()
// }

// const { info } = require('autoprefixer')
// const fast2sms=require('fast-two-sms')

// const sendMsg=async (message,to)=>{
//     let info=await fast2sms.sendMessage({authorization:process.env.FAST2SMS_AUTH,message,numbers:[to]})
//     return info
// }

// // sendMsg('hello','+917980413801').then(info=>{
// //     console.log(info)
// // })

// var settings = {
//     "async": true,
//     "crossDomain": true,
//     "url": "https://www.fast2sms.com/dev/bulkV2",
//     "method": "POST",
//     "headers": {
//       "authorization": process.env.FAST2SMS_AUTH,
//     },
//     "data": {
//       "variables_values": "5599",
//       "route": "otp",
//       "numbers": "7980413801",
//     }
//   }

// fetch("https://www.fast2sms.com/dev/bulkV2",settings).then(res=>{
//     res.json().then(val=>{
//         console.log(val)
//     })
// })