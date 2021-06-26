const router = require('express').Router()
const homeController = require('./../../controller/frontend/homeController')
const formValid = require('./../../controller/auth/formValid')
const postController = require('./../../controller/frontend/postController')
const jobController = require('../../controller/frontend/jobController')
const profileController = require('../../controller/frontend/profileController')
const authController = require('../../controller/auth/auth')



//Index Route
router.get('/', homeController.showIndex)
router.post('/', formValid.newsLetterValid(), formValid.newsLetterValidation, homeController.subscribeProcess)

//Login Route
router
    .get('/login', homeController.showLogin)
    .post('/login', formValid.loginValid(), formValid.loginValidation,authController.login)

//Register Route
router
    .route('/register')
    .get(homeController.showRegister)
    .post(formValid.registerValid(), formValid.registerValidation,authController.singup)

//User Route
router
    .route('/profile')
    .get(authController.checkLogin,profileController.showProfile) //Show Profile
    .post(authController.checkLogin,formValid.infoValid(), formValid.infoValidation, profileController.editUser) //Edit
router.get('/editinformation',authController.checkLogin,profileController.showEditData)
router.get('/Users/:id',authController.checkLogin, profileController.showUser) //Show Another User

router.delete('/profile/deleteavatar',authController.checkLogin,profileController.deleteAvatar)
router.delete('/profile/deleteaccount',authController.checkLogin,profileController.deleteAccount)





//My Post
router.get('/MyPosts',authController.checkLogin , jobController.showMyPosts)
router.get('/MyPosts/:id',authController.checkLogin, authController.checkPermission, jobController.showOwnPost)


//CRUD Post
router
    .get('/newpost',authController.checkLogin, postController.showCreatePost) //Add Validator
    .post('/newpost',authController.checkLogin,formValid.newPostValid(),formValid.newPostValidation, postController.createPost) //NewPost
    .delete('/MyPosts/:id',authController.checkLogin,authController.checkPermission, postController.deletePost)
    .put('/MyPosts/:id',authController.checkLogin,authController.checkPermission, postController.showEdit) //Only For Show Edit
    .patch('/MyPosts/:id',authController.checkLogin,authController.checkPermission, postController.editPost) //add Validator


// show jobs And Post And Applicat
router.get('/Jobs/', jobController.showJobTemp)
router
    .get('/Jobs/:id', jobController.showJob)
    .post('/jobs/:id',authController.checkLogin, jobController.ApplicantedJob)


//Live Search
router.get('/livesearch', homeController.liveSearch)




//Show Applicanted
router.post('/myposts/Applicanted/:id',authController.checkLogin, authController.checkPermission, jobController.ShowApplicant)

//LogOut
router.get('/logout',authController.checkLogin,authController.logout)


//Reset Password 
router.get('/resetpassword',homeController.showResetPassword)
router.post('/resetpassword',authController.sendResetPassword)

// Process Reset Password
router.get('/resetpassword/:token',homeController.showResetPasswordLink)
router.post('/resetpassword/:token',formValid.resetPasswordValid(),formValid.resetPasswordValidation,authController.resetPasswordProccess)

module.exports = router