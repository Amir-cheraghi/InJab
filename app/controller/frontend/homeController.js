const crypto = require('crypto')
const NewsLetter = require("../../models/newslatter");
const Post = require("./../../models/post")
const User = require('./../../models/user')

module.exports = new (class homeController {

  //Show Index
  async showIndex(req, res) {
    
    res.render("index", {
      data:req.user,
      title: "شغل یابی اینترنتی این جاب",
      message: req.flash("message"),
      alert: req.flash("alert"),
      login: req.user.login,
      name : req.user.name,
        username : req.user.username,
    });
  }


  //Show Login
  showLogin(req, res) {
    if(req.user.login) res.redirect('profile')
    res.render("frontend/Login", {
      title: "ورود | شغل یابی اینترنتی این جاب ",
      message: req.flash("message"),
      alert: req.flash("alert"),
      login: req.user.login,
      name : req.user.name,
        username : req.user.username,
    });
  }


  //Show Login
  showRegister(req, res) {
        if(req.user.login) res.redirect('profile')
    res.render("frontend/Register", {
      title: "عضویت | شغل یابی اینترنتی این جاب ",
      alert: req.flash("alert"),
      message: req.flash("message"),
      login: req.user.login,
      name : req.user.name,
        username : req.user.username,
    });
  }


  //Subscribe NewsLatter
  async subscribeProcess(req, res) {
    try {
      const data = { email: req.query.email };
      if (await NewsLetter.findOne(data)) {
        res.json({
          alert: "alert-warning",
          message: "شما قبلا در خبرنامه عضو شده اید",
        });
      } 
      else {
        await NewsLetter.create(data);

        res.json({
          alert: "alert-success",
          message: "عضویت در خبرنامه با موفقیت انجام شد",
        });
      }
    } catch (err) {
      let message = err;
      if (err.errors.email.message) message = err.errors.email.message;

      res.json({
        alert: "alert-warning",
        message,
      });
    }
  }

  //Show Reset Password
  async showResetPassword(req,res,next){
    if(req.user.login) return res.redirect('/profile')
    res.render('frontend/resetPassword',{
      login : req.user.login,
      title : 'فراموشی رمز عبور | شغل یابی اینترنتی این جاب',
    })
  }


//Show Reset Password Link
  async showResetPasswordLink(req,res,next){
    if(req.user.login) return res.redirect('/profile')

    const token = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({resetPassToken:token , resetPassTokenExpire : {$gte : Date.now()}})
    let expired = false
    if(!user) expired = true 
    res.render('frontend/resetPasswordLink',{
      login : req.user.login,
      title : 'فراموشی رمز عبور | شغل یابی اینترنتی این جاب',
      message : req.flash('message'),
      alert : req.flash('alert'),
      expired 
    })
  }



  //Live Search
  async liveSearch(req,res){  
    try {
      const query = JSON.stringify(req.query)
      const input =query.replace(/\b(search|text)\b/g ,(item)=>{ return `$${item}`})
      const data = await Post.find(JSON.parse(input) , {title : 1 , id : 1})
      if(data.length!=0) {
        res.json({data})
      }
      else {
        res.json({data : [{title : 'نتیجه ای یافت نشد' , _id:'#'}]})
      }
    } 
    catch (err) {
      console.log(err)
    }
  }


})();
