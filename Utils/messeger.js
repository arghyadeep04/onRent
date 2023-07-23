if (process.env.NODE_ENV !=="production") {
    require('dotenv').config()
}

async function sendMsg(phoneNumber,otp){
    let res=await fetch(`https://2factor.in/API/V1/${process.env.TWOFACTOR_APIKEY}/SMS/${phoneNumber}/${otp}/OTP1`)
    let obj= await res.json()
    console.log(obj)
}

module.exports={sendMsg};