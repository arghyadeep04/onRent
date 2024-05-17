if (process.env.NODE_ENV !=="production") {
    require('dotenv').config()
}
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.COMP_EMAIL,
    pass: process.env.COMPEMAIL_PASS
  }
});

// async..await is not allowed in global scope, must use a wrapper
async function emailSender(to,subject,html) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'onrent2023@gmail.com', // sender address
    to:to,
    subject:subject,
    // text: "Hello world?", // plain text body
    html:html, // html body
  });
  return info;
}

module.exports={emailSender}