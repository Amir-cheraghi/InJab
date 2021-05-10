const mongoose = require("mongoose");
const paginate = require('mongoose-paginate-v2')

const postSchema = new mongoose.Schema(
  {
    username: {type : String},
    name: {type : String},
    publisherId : {type : String},
    title: {type : String , trim : true},
    description: {type : String},
    category : {type : String , required : true},
    city : {type : String , required : true},
    time : {type : String , required : true},
    gender : {type : String , required : true},
    degree :{type : String , required : true},
    skills: {type : Array},
    company: {type : String},
    salary: {type : String},
    address: {type : String},
    Applicanted : {type : Array , default : []},
    publisherId : {type : String , required:[true , 'We Need Publisher Id'] , default:'6079d1ebc87aaa0cdc6acf84'}
  },
  { timestamps: true }
);
postSchema.index({ title: 'text', skills: 'text', description: 'text' , category : 'text' });
postSchema.plugin(paginate)
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
