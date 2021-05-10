const fs = require('fs')
const path = require('path')
const {promisify} = require('util')
const crypto = require('crypto')
const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const jimp = require('jimp')



const userSchema = new mongoose.Schema(
  {
    admin: { type: Boolean, default: false },
    role: { type: String, required: true , enum : ['کارفرما','کارجو'] },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true , select : false },
    resetPassToken : {type : String},
    resetPassTokenExpire :{type : Date},
    passwordChangedAt : {type : Date},
    name: { type: String , required : true},
    descrption: { type: String },
    avatar: { type: String , default :process.env.DEFAULT_AVATAR },
    city: { type: String},
    language: { type: String},
    phone: { type: String},
    interest: { type: Array},
    resume: { type: Array},
    instagram: { type: String},
    twitter: { type: String},
    github: { type: String},
    website: { type: String},
    skills: { type: Array},
    skillpersent: { type: Array},
    color : {type : Array , default : ['success' , 'info' , 'danger' , 'primary' ,'warning']},
    complated : {type : Boolean , default : false}
  },
  { timestamps: true }
);
//Hash Password
userSchema.pre("save",async function(next){
if(!this.isModified('password')) return next()
this.password = await bcrypt.hash(this.password,12)
})

//Set Password Change Time
userSchema.pre('save',function(next){
  if(!this.isModified('password') || this.isNew) return next()
  this.passwordChangedAt = Date.now()
  next()
})

// Compare Hashed Password
userSchema.methods.comparePassword = async (formPass,userPass)=>{
  return await bcrypt.compare(formPass,userPass)
}

//Resize Image
userSchema.methods.resizeImage = async (filePath)=>{
  //Resize Image 
  const largeFile = path.resolve(process.cwd(),filePath)
  const resizedFile = path.resolve(process.cwd(),filePath).replace('user','user\\resized')
  const finalFile = filePath.replace('user','user\\resized').replace("src\\public", "")
  const resize = await jimp.read(largeFile)
  await resize
  .resize(256, 256)
  .quality(60)
  .writeAsync(resizedFile)
  //Remove Large Img
  const remove = promisify(fs.unlink)
  remove(largeFile)
  //Submit Addres
  return finalFile
  
}

// Create Password Token
userSchema.methods.createResetPassToken =async function (userId){
  //Create Random String
  const token = crypto.randomBytes(32).toString('hex')
  //Store Hashed String And SetDate Expire
  this.resetPassToken = crypto.createHash('sha256').update(token).digest('hex')
  this.resetPassTokenExpire = new Date(Date.now()).getTime()+10*60*1000
  //Return Token To Send User
  return token
}


const User = mongoose.model("User", userSchema);

module.exports = User;
