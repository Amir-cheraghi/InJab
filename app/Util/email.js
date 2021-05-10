const nodemailer = require('nodemailer')

email = async (receiver,subject,message,html)=>{
const transporter = nodemailer.createTransport({
    service: "Gmail",
    port : 587,
    auth : {
        user : process.env.EMAIL_USERNAME,
        pass : process.env.EMAIL_PASSWORD
    }
})
const info = await transporter.sendMail({
    from : process.env.EMAIL_USERNAME,
    to : receiver,
    subject ,
    text : message,
    html
})
return info
}


module.exports = email