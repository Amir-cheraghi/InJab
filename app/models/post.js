const mongoose = require("mongoose");
const paginate = require('mongoose-paginate-v2')

const postSchema = new mongoose.Schema(
  {
    publisherId : {type : String},
    title: {type : String , trim : true , required : true},
    description: {type : String , required : true},
    category : {type : String , required : true},
    city : {type : String , default : 'مهم نیست'},
    time : {type : String , default : 'مهم نیست'},
    gender : {type : String , default : 'مهم نیست'},
    degree :{type : String , default : 'مهم نیست'},
    skills: {type : Array , required : true},
    company: {type : String , default : 'توضیحاتی ارائه نشده است'},
    salary: {type : String , default : 'توافقی'},
    address: {type : String , required : true},
    Applicanted : {type : Array , default : []},
    publisherId : {type : String , required:[true , 'We Need Publisher Id']}
  },
  { timestamps: true }
);
postSchema.index({ title: 'text', skills: 'text', description: 'text' , category : 'text' });
postSchema.plugin(paginate)
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
