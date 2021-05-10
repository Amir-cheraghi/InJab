const PostModel = require("./../../models/post");
const mongoose = require("mongoose");
const User = require("../../models/user");
const moment = require('moment-jalaali');
const Category = require("../../models/category");
const queryFilter = require('../../Util/queryFilter')
const email = require('../../Util/email')

moment.loadPersian({ usePersianDigits: true })

module.exports = new (class postController {

  //Show All Job
  async showJobTemp(req, res) {
    try {
      const data = await queryFilter(req.query)
      res.render("frontend/jobs", {
        ...data,
        title: "آگهی ها | شغل یابی اینترنتی این جاب ",
        login: req.user.login,
        name : req.user.name,
        username : req.user.username,
        message: req.flash('message'),
        alert: req.flash('alert')
      });

    } catch (err) {
      console.log(err)
      res.redirect('/404')
    }
  }

  //Show Post You Shared
  async showMyPosts(req, res) {
    try {
      const data = await queryFilter(req.query,req.user._id)
      res.render("frontend/myposts", {
        ...data,
        title: "آگهی های من | شغل یابی اینترنتی این جاب ",
        login: req.user.login,
        name : req.user.name,
        username : req.user.username,
        message: req.flash('message'),
        alert: req.flash('alert')
      });

    } catch (err) {
      console.log(err)
      res.redirect('/404')
    }
  }

  //Show Job
  async showJob(req, res) {
    try {
      const data = await PostModel.findById(req.params.id);
      if(data.publisherId == req.user._id) res.redirect(`/myposts/${req.params.id}`)
      res.render("frontend/userPostView", {
        title: `${data.title}  | شغل یابی اینترنتی این جاب `,
        login: req.user.login,
        data: data,
        name : req.user.name,
        username : req.user.username,
        message: req.flash('message'),
        alert: req.flash('alert'),
        date: moment(data.createdAt).locale('fa').format('منتشر شده در jDD jMMMM jYYYY')
      });
    } catch (err) {
      res.redirect("/404");
    }
  }

  //Show Post In Publisher View
  async showOwnPost(req, res) {
    const data = await PostModel.findById(req.params.id)
      res.render('frontend/companyPostView', {
        title: `${data.title}  | شغل یابی اینترنتی این جاب `,
        login: req.user.login,
        data,
        name : req.user.name,
        username : req.user.username,
        message: req.flash('message'),
        alert: req.flash('alert'),
        date: moment(data.createdAt).locale('fa').format('منتشر شده در jDD jMMMM jYYYY')
      })
    
  }



  //Applicanted
  async ApplicantedJob(req, res) {

    const user = await User.findById(req.user._id)
    if(!user.complated){
      req.flash('message','لطفا جهت ثبت درخواست ابتدا نسبت به تکمیل اطلاعات خود اقدام کنید')
      req.flash('alert','alert-primary')
      return res.send({url : '/editinformation'})
    }
    let applicantLength = await PostModel.findById(req.params.id)
    try {
      const post = await PostModel.findById(req.params.id)
      if (post.Applicanted.includes(req.user._id))
      {
        res.json({
          alert: 'alert-warning',
          message: 'درخواست شما قبلا ثبت شده است ',
          length: applicantLength.Applicanted.length
        })
      }
      else {
        //Submit Request
        const post = await PostModel.findByIdAndUpdate(req.params.id, { $push: { Applicanted: req.user._id } })
        //Send Mail To Publisher
        const receiver = await User.findById(post.publisherId)
        const message = `جناب ${user.name} عزیز کاربر ${req.user.name} برای آگهی ${post.title} درخواست داده است `
        const html = `<p style = text-direction:rtl >${message}</p>`
        res.json({
          message: 'درخواست شما با موفقیت ثبت شد',
          alert: 'alert-success',
          length: post.Applicanted.length + 1 
        })
        const sendMail = await email(receiver.email,'درخواست جدید برای آگهی',message,html)
        console.log(sendMail)
      }
    }
    catch (err) {
      console.log(err)
      res.json({
        alert: 'alert-danger',
        message: 'خطایی رخ داده است لطفا مجددا تلاش فرمایید',
        length: applicantLength.Applicanted.length
      })

    }
  }



  //Show Applicant
  async ShowApplicant(req, res) {

    const post = await PostModel.findById(req.params.id)
    const applicanted = post.Applicanted
    const data = []

    for (const item of applicanted) {
      data.push(await User.findById(item, { _id: 1, name: 1, descrption: 1, skills: 1, avatar: 1 }))
    }
    res.render('frontend/applicanted', {
      title: 'متقاضی ها  | شغل یابی اینترنتی این جاب ',
      login: req.user.login,
      data,
      name : req.user.name,
      username : req.user.username,
    })
  }

})();
