const router = require('express').Router()

router.use('/',require('./frontend/home'))
router.use('/admin',require('./admin/admin'))




module.exports = router