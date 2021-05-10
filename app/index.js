const path = require("path");
const dotEnv = require('dotenv').config({path :path.join( process.cwd() ,'/config/config.env')})
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoStore = require('connect-mongo')
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const favIcon = require('serve-favicon')
const app = express();
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const passport = require('passport')
const jwt = require('jsonwebtoken')

const multer = require("multer");
const User = require("./models/user");

module.exports = class application {
  constructor() {
    this.setConfig();
    this.setExpress();
    this.setDataBase();
    this.setJWT()
    this.setRoute();
    this.set404();
    

  }

  async setDataBase(){
    await mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      })
    console.log('Connected To DB')

    }

  setConfig() {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(flash());
    app.use(
      session({
        secret: process.env.SESSION_KEY,
	      saveUninitialized: true,
        resave : false ,
        store : new mongoStore({mongoUrl : process.env.DATABASE_URL} ),
        cookie: { httpOnly: true, maxAge: 24*60*60*1000},
      })
    );
    
    app.use(methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method
        delete req.body._method
        return method
      }
    }))


    
    app.set("views", path.join( __dirname , process.env.VIEW_FOLDER_PATH ));
    app.set("view engine", process.env.VIEW_ENGINE);
    app.use(express.static(path.join( __dirname , process.env.PUBLIC_FOLDER_PATH )));
    app.use(expressLayouts);
    app.set("layout", process.env.MASTER_LAYOUT_PATH);
    app.set("layout extractScripts", true);
    app.set("layout extractStyle", true);
    app.use(favIcon(path.join(__dirname,process.env.FAV_ICON_PATH)));
    app.use(passport.initialize());
    app.use(passport.session());
  }
  
  setJWT(){
    app.use(async (req,res,next)=>{
      try{
      if(req.session.tk){
      const verify = jwt.verify(req.session.tk,process.env.JWT_KEY)
      const user = await User.findOne({_id:verify.id})
      if(user.passwordChangedAt && Math.floor(user.passwordChangedAt.getTime()/1000) > verify.iat){
        req.session.destroy()
        return res.redirect('/login')
      }
      req.user = {...user._doc , login : true}
      next()
      }
      else {
        req.user = {login :false}
        next()
      }
      }catch(err){
        console.log(err)
        next()
      }
    })
  }
    
  
  setRoute() {
    app.use(require("./../app/routes/routes"));
  }
  

 

  set404() {
    app.use((req, res, next) => {
      res.status(404).render("frontend/404", {
        title: "صفحه مورد نظر پیدا نشد !!",
        login: req.user.login,
        name:req.user.name,
        username : req.user.username
      });
    });
  }

  setExpress() {
    app.listen(process.env.PORT, () => {
      console.log("server IS Running ....");
    });
  }
  
};
