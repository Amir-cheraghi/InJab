const crypto = require('crypto')
const User = require('./../../models/user')
const Post = require('./../../models/post')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const email = require('./../../Util/email')
require('./../../passport/local-strategy')

module.exports = new class autentication {

    async singup(req, res, next) {
        passport.authenticate('local-register', {
            failureFlash: true,
            successFlash: true,
            failureRedirect: '/register',
            successRedirect: '/profile'
        })(req, res, next)
    }


    async login(req, res, next) {
        passport.authenticate('local-login', {
            failureFlash: true,
            failureRedirect: '/login',
            successFlash: true,
            successRedirect: '/profile'
        })(req, res, next)
    }
    async logout(req, res, next) {
        try {
            await req.session.destroy()
            res.redirect('/')
        }
        catch (err) {
            console.log(err)
        }
    }

    checkLogin(req, res, next) {
        if (!req.user.login) res.redirect('/login')
        next()
    }


    async checkPermission(req, res, next) {
        const post = await Post.findById(req.params.id)

        if (!(req.user._id == post.publisherId)) {
            req.flash('message', 'دسترسی شما مجاز نمیباشد')
            req.flash('alert', 'alert-danger')
            res.redirect('/myposts')
        }
        next()
    }


    async sendResetPassword(req, res, next) {
        // Check Email Exists
        const user = await User.findOne({ email: req.query.email })
        if (!user) {
            return  res.json({
                status: 'err',
                message: '. حساب کاربری مطابق با ایمیل وارد دشده یافت نشد  ',
                alert: 'alert-danger'
            })
        }
        //create Token
        const token = await user.createResetPassToken()
       await user.save({ validateBeforeSave: false })
        //Send Email
        const url = `${req.protocol}://${req.get('host')}/resetpassword/${token}`
        const subject = 'لینک تغییر رمز عبور ( معتبر برای 10 دقیقه )'
        const message = `با استفاده از لینک زیر قادر به تغییر رمز حساب کاربری خود خواهید بود \n ${url} \nاگر شما برای تغییر رمز عبور درخواستی نداده اید از این پیام صرف نظر فرمایید `
        const info = email(user.email, subject, message)
        //Send Response To User
        res.json({
            status: 'success',
            message: '. لینک تغییر رمز عبور با موفقیت ارسال شد ',
            alert: 'alert-success'
        })
    }



    async resetPasswordProccess(req, res, next) {
    try {
        const token = crypto.createHash('sha256').update(req.params.token).digest('hex')
        const user = await User.findOne({resetPassToken:token , resetPassTokenExpire : {$gte : Date.now()}})
        if(!user){
            req.flash('message','لینک منقضی شده است')
            req.flash('alert','alert-danger')
            res.redeirect('/resetpassword')
           return next()
        }else{
        user.password = req.body.password
        user.resetPassToken = undefined
        user.resetPassTokenExpire = undefined
        await user.save()
        
       

        req.flash('message','رمز عبور با موفقیت تغییر یافت')
        req.flash('alert','alert-success')
        res.redirect('/login')

        }
    } catch(err){
        console.log(err)
    }
}

}