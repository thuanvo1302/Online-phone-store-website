var express = require('express');
var router = express.Router();
const isAuthenticated = require('../middleware/authentication');


// Controller
const userController = require('../controllers/userController')

// upload
const { upload } = require('../middleware/upload')

// [GET]
/* GET users listing. */
router.get('/', userController.getAllUsers)

router.get('/edit/:id', userController.getEditUser)


// GET show add user page
router.get('/add', (req, res) => {
    res.render('page-add-user', { title: 'Add user' })
})

// GET verify email
router.get('/email-verification', userController.verifyEmail)

// GET show signin page
router.get('/sign-in', (req, res) => {
    res.render('auth-sign-in', { title: 'Signin page' })
})

// GET show report page
router.get('/report', (req, res) => {
    res.render('page-report', { title: 'Report page' })
})

// [POST]
// POST add user
router.post('/add', upload.single('profilePicture'), userController.createUserAccount)

router.post('/resend',userController.resendEmail)

// POST sign in
router.post('/signin', userController.signinUser)



// [PUT]
// PUT update info user
router.put('/update', isAuthenticated , upload.single('profilePicture'), userController.updateUser)

router.put('/updateLockedStatus/:email',userController.updateLockedStatus)



module.exports = router;
