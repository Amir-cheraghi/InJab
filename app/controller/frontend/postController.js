const PostModel = require('./../../models/post')
const mongoose = require('mongoose');
const Category = require('../../models/category');
module.exports = new (class postController {


  // Show Create Poat
  async showCreatePost(req, res) {
    const category = await Category.find()
    res.render("frontend/newPost", {
      title: "ایجاد آگهی جدید  | شغل یابی اینترنتی جابین",
      login: req.user.login,
      data: { city: '' },
      name: req.user.name,
      username: req.user.username,
      jobs: category.find(el => { return el.name === 'jobs' }).data,
      citys: category.find(el => { return el.name === 'citys' }).data,
      degree: category.find(el => { return el.name === 'degree' }).data,
      gender: category.find(el => { return el.name === 'gender' }).data,
      time: category.find(el => { return el.name === 'time' }).data,
      message: req.flash("message"),
      alert: req.flash("alert")
    });
  }


  // Process Create Post
  async createPost(req, res) {

    try {

      await PostModel.create({ ...req.body, publisherId: req.user._id })
      req.flash('message', 'پست با موفقیت ایجاد شد')
      req.flash('alert', 'alert-success')
      res.redirect('/myposts')
    } catch (err) {
      console.log(err)
      req.flash('message', 'خطایی هنگام انتشار پست به وجود آمده است')
      req.flash('alert', 'alert-danger')
      res.redirect('/newpost')
    }
  }



  // Delete Post
  async deletePost(req, res) {
    try {
      await PostModel.findByIdAndDelete(req.params.id)
      req.flash('message', 'آگهی با موفقیت حذف شد')
      req.flash('alert', 'alert-success')
      res.redirect('/myposts')


    } catch (err) {
      req.flash('message', 'هنگام حذف آگهی مشکلی پیش آمده است لطفا مجددا تلاش نمایید')
      req.flash('alert', 'alert-danger')
      res.redirect('/myposts')
    }
  }



  // Show Edit Post
  async showEdit(req, res) {
    try {
      const data = await PostModel.findById(req.params.id)
      const category = await Category.find()
      res.render('frontend/editPost', {
        title: 'ویرایش پست  | شغل یابی اینترنتی این جاب ',
        login: req.user.login,
        jobs: category.find(el => { return el.name === 'jobs' }).data,
        citys: category.find(el => { return el.name === 'citys' }).data,
        degree: category.find(el => { return el.name === 'degree' }).data,
        gender: category.find(el => { return el.name === 'gender' }).data,
        time: category.find(el => { return el.name === 'time' }).data,
        data,
        name: req.user.name,
        username: req.user.username,

      })

    } catch (err) {
      req.flash('message', ['مشکلی پیش آمده است لطفا مجددا تلاش نمایید'])
      req.flash('alert', 'alert-danger')
      res.redirect(`/MyPosts/${req.params.id}`)
    }
  }







  // Process Edit Post
  async editPost(req, res) {
    try {
      await PostModel.findByIdAndUpdate(req.params.id, req.body)
      req.flash('message', 'ویرایش آگهی با موفقیت انجام شد')
      req.flash('alert', 'alert-success')
      res.redirect(`/MyPosts/${req.params.id}`)

    } catch (err) {
      req.flash('message', 'هنگام ویرایش آگهی مشکلی پیش آمده است لطفا مجددا تلاش نمایید')
      req.flash('alert', 'alert-danger')
      res.redirect(`/MyPosts/${req.params.id}`)
    }
  }



})();