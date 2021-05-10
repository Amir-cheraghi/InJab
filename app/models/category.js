const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({

    name : {type : String},
    data : {type : Array}
})
const Category = mongoose.model('Category',categorySchema)
module.exports = Category

