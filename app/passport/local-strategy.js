const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user')


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});


passport.use('local-register', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        let user = await User.findOne({email})
        if (user) return done(null, false, req.flash('message', 'چنین کاربری با این ایمیل قبلا ثبت نام کرده است لطفا ایمیل دیگری را برای ثبت نام انتخاب کنید '), req.flash('alert', 'alert-danger'))
        if (!user) {
          const data =  await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            })
            req.session.tk = jwt.sign({id : data._id} , process.env.JWT_KEY , {expiresIn : process.env.JWT_EXPIRE}) 
            done(null, data, req.flash('message', 'ثبت نام با موفقیت انجام شد لطفا در اولین فرصت اطلاعات خود را تکمیل کنید'), req.flash('alert', 'alert-success'))
        }
    } catch (err) {
        console.log(err)
        done(null, false, req.flash('message', 'هنگام ثبت نام خطایی رخ داده است لطفا مجددا تلاش فرمایید'), req.flash('alert', 'alert-danger'))
    }
}))




passport.use('local-login',new localStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
},async(req,email,password,done)=>{
    try{
    const user = await User.findOne({email}).select({password:1,name:1,complated:1})
    if(!user) return done(null,false,req.flash('message','نام کاربری یا رمز عبور اشتباه است . '),req.flash('alert','alert-danger'))
    if(! await user.comparePassword(password,user.password)) return done(null,false,req.flash('message','نام کاربری یا رمز عبور اشتباه است . '),req.flash('alert','alert-danger'))
    req.session.tk = jwt.sign({id : user._id} , process.env.JWT_KEY , {expiresIn : process.env.JWT_EXPIRE})
    if (user.complated) return done(null,user,req.flash('message',`${user.name} عزیز خوش آمدید`),req.flash('alert','alert-success'))
    done(null,user,req.flash('message',`${user.name} عزیز خوش آمدید، لطفا نسبت به تکمیل اطلاعات خود اقدام کنید`),req.flash('alert','alert-success'))
    }catch(err) 
    {
        console.log(err)
        done(err,false,req.flash('message','هنگام ورود خطایی رخ داده است لطفا مجددا تلاش فرمایید'),req.flash('alert','alert-warning'))
    }
}
))