const { check, validationResult } = require("express-validator");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/public/uploads/user");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

module.exports = new (class formValid {
  loginValid() {
    return [
      check("email", "ایمیل نمیتواند خالی باشد").notEmpty(),
      check("password")
        .notEmpty()
        .withMessage("رمز عبور  نمیتواند خالی باشد")
        .isLength({ min: 8, max: 32 })
        .withMessage("رمز عبور باید بین 8 تا 32 حرف باشد"),
    ];
  }

  registerValid() {
    return [
      check("email", "ایمیل نمیتواند خالی باشد").notEmpty(),
      check("name")
        .notEmpty()
        .withMessage("نام و نام خانوادگی نمیتواند خالی باشد")
        .matches(/^[ آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئ\s]+$/)
        .withMessage("لطفا نام خود را فارسی وارد نمایید"),
      check("password")
        .notEmpty()
        .withMessage("رمز عبور  نمیتواند خالی باشد")
        .isLength({ min: 8, max: 32 })
        .withMessage("رمز عبور باید بین 8 تا 32 حرف باشد")
        .custom((value, { req }) => {return value === req.body.repassword;})
        .withMessage("رمزهای عبور یکسان نیستند"),
    ];
  }

  infoValid() {
    return [
      upload.single("avatar"),
      check("name")
        .notEmpty()
        .withMessage("نام و نام خانوادگی نمیتواند خالی باشد")
        .matches(/^[ آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئ\s]+$/)
        .withMessage("لطفا نام خود را فارسی وارد نمایید"),
      check("descrption", "لطفا توضیحاتی در مورد خود بنویسد").notEmpty(),
      check("phone")
        .notEmpty()
        .withMessage("لطفا تلفن همراه خود را وارد نمایید")
        .matches(/^(\+989|9|09)(12|19|35|36|37|38|39|32|21|01|10)\d{7}$/)
        .withMessage(
          "لطضا شماره تلفن همراه را صحیح وارد کنید (ممکن است شماره شما پشتیبانی نشود)"
        ),
    ];
  }

  newsLetterValid() {
    return [check("email", "ایمیل معتبر نمیباشد").isEmail()];
  }

  resetPasswordValid() {
    return [
      check("password")
        .notEmpty()
        .withMessage("رمز عبور  نمیتواند خالی باشد")
        .isLength({ min: 8, max: 32 })
        .withMessage("رمز عبور باید بین 8 تا 32 حرف باشد")
        .custom((value, { req }) => {return value === req.body.repassword;})
        .withMessage("رمزهای عبور یکسان نیستند"),
    ];
  }



  loginValidation(req, res, next) {
    if (validationResult(req).array() != 0) {
      req.flash("message",validationResult(req).array().map((item) => {return item.msg;}));
      req.flash("alert", "alert-danger");
      res.redirect("/login");
    } else next();
  }

  registerValidation(req, res, next) {
    if (validationResult(req).array() != 0) {
      req.flash("message",validationResult(req).array().map((item) => {return item.msg;}));
      req.flash("alert", "alert-danger");
      res.redirect("/register");
    } else next();
  }

  infoValidation(req, res, next) {
    if (validationResult(req).array() != 0) {
      req.flash("message",validationResult(req).array().map((item) => {return item.msg;}));
      req.flash("alert", "alert-danger");
      res.redirect("/editinformation");
    } else next();
  }

  newsLetterValidation(req, res, next) {
    if (validationResult(req).array() != 0) {
      res.json({
        message: "ایمیل معتبر نمیباشد",
        alert: "alert-danger",
      });
    } else next();
  }

  resetPasswordValidation(req, res, next) {
    if (validationResult(req).array() != 0) {
      req.flash("message",validationResult(req).array().map((item) => {return item.msg;}));
      req.flash("alert", "alert-danger");
      res.redirect(req.headers.referer);
    } else next();
  }
})();
