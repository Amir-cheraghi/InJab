const mongoose = require('mongoose')

const newsLetterSchema = new mongoose.Schema({

    email : {
        type:String ,
        required : [true , 'ایمیل نمیتواند خالی باشد'] ,
       
    }

} , {timestamps : true})

const NewsLetter = mongoose.model('NewsLetter',newsLetterSchema)


module.exports = NewsLetter