const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const mongoose = require("mongoose");
const jimp = require('jimp')
const User = require("./../../models/user");
const Post = require("./../../models/post");
const Category = require("./../../models/category");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.AVATAR_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

module.exports = new (class profileController {
  //Show Profile
  async showProfile(req, res) {
    const data = await User.findById(req.user._id);
    res.render("frontend/profile", {
      title: "پنل کاربری | شغل یابی اینترنتی این جاب ",
      login: req.user.login,
      message: req.flash("message"),
      alert: req.flash("alert"),
      data,
      edit: true,
      name: req.user.name,
      username: req.user.username,
    });
  }

  //Other Another User Profile
  async showUser(req, res) {
    try {
      const data = await User.findById(req.params.id);
      res.render("frontend/profile", {
        title: `${req.user.name}  | شغل یابی اینترنتی این جاب `,
        login: req.user.login,
        message: req.flash("message"),
        alert: req.flash("alert"),
        data,
        edit: false,
        name: req.user.name,
        username: req.user.username,
      });
    } catch (err) {
      res.redirect("/404");
    }
  }

  // Show User Edit Data
  async showEditData(req, res) {
    const citys = await Category.findOne({ name: "citys" });
    const data = await User.findById(req.user._id);
    res.render("frontend/editInfo", {
      title: "ویرایش اطلاعات | شغل یابی اینترنتی این جاب ",
      login: req.user.login,
      message: req.flash("message"),
      alert: req.flash("alert"),
      data,
      citys: citys.data,
      name: req.user.name,
      username: req.user.username,
    });
  }

  //Submit Edit
  async editUser(req, res) {
    try {
      let avatar = process.env.DEFAULT_AVATAR;

      //If Change Avatar With Antoher
      if (typeof req.file !== "undefined" && req.user.avatar != avatar){
          //Resize Image
          const user = await User.findById(req.user._id)
          avatar = await user.resizeImage(req.file.path)
          //Delete Pre Image
          const remove = promisify(fs.unlink)
          await remove(path.join(process.cwd(),'/src/public/',req.user.avatar))
      }
      //If Change With Default
      if (typeof req.file !== "undefined" && req.user.avatar === avatar){
        //Resize Image
        const user = await User.findById(req.user._id)
        avatar = await user.resizeImage(req.file.path)
      }
      //If Not Changed
      if (typeof req.file === 'undefined') avatar = req.user.avatar


      const data = req.body
      const except = ['admin', 'role', 'createdAt', 'updatedAt' , 'password', 'id', 'colors', 'complated']
      except.forEach(el => delete data[el])
      await User.findByIdAndUpdate(req.user._id, {
        ...data,
        avatar: avatar,
        complated: true
      });

      req.flash("message", "اطلاعات شما با موفقیت تغییر یافت");
      req.flash("alert", "alert-success");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
      req.flash("message", "ویرایش اطلاعات با خطا مواجه شد لطفا مجددا تلاش فرمایید ، ممکن است تصویر شما پشتیبانی نشود .");
      req.flash("alert", "alert-danger");
      res.redirect("/profile");
    }
  }


  // Delete Avatar
  async deleteAvatar(req, res) {
    try {
      
      const remove = promisify(fs.unlink)
      await remove(path.join(process.cwd(),'/src/public/',req.user.avatar))
      const data = await User.findByIdAndUpdate(req.user._id, { avatar: process.env.DEFAULT_AVATAR })
      res.json({
        status: 'success',
        avatar: process.env.DEFAULT_AVATAR
      })

    } catch (err) {
      console.log(err)
      res.json({
        status: 'error',
      })
    }

  }


  // Delete User Account
  async deleteAccount(req, res) {
    try {
      //Delete User Photo
      if(req.user.avatar != process.env.DEFAULT_AVATAR){
      const remove = promisify(fs.unlink)
      await remove(path.join(process.cwd(),'/src/public/',req.user.avatar))
      }
      //delete User
      await User.findByIdAndDelete(req.user._id)
      //delete Post Shared By User 
      await Post.deleteMany({publisherId : req.user._id})
      // delete applicanted Req By User
       await Post.updateMany({ $pull: { Applicanted: req.user._id } })
      // Destroy Session
      await req.session.destroy()
      
      res.json({
        status: 'success',
        url: '/'
      })
    
    } catch (err) {
      console.log(err)
      res.json({
        status: 'error',
      })
    }

  }
})();
