// bcrypt
var bcrypt = require('bcryptjs')

// model
const User = require('../models/User')

// mail
const { main } = require('../helpers/nodemailer')

// jwt
const { jwt } = require('../helpers/jwt')

const userController = {
    getAllUsers: async (req, res) => {
        await User.find({ role: 'saleperson' })
            .then(users => {
                res.render('page-list-user', { title: 'List user', users })
            })
            .catch(err => {
                console.log(err)
                next()
            })
    },
    getEditUser: async (req, res) => {
        const id = req.params.id;
        try {
            const user = await User.findById(id);
            res.render('user-profile-edit', { title: 'Page edit user', user })
        } catch (e) {
            res.render('page-error-404', { title: '404' });
        }
    },
    verifyEmail: (req, res, next) => {
        var account = null
        if (req.query.token) {
            try {
                account = jwt.verifyJwt(req.query.token);
            } catch (error) {
                console.log(error);
                return res.render('page-jwt-expired', { title: 'JWT Expired Page' });
            }
        }
        if (account) {
            // console.log(account)
            User.findOne({ email: account.email })
                .then((user) => {
                    user = user.toObject()
                    user.password = account.pass
                    user.isVerified = true
                    req.session.user = user
                    console.log(user)
                    res.render('form-confirm-email', { title: 'Verification email page', user })
                })
                .catch(error => {
                    console.log(error)
                    res.status(400).json({ message: error.message })
                    next()
                })
        }
        else {
            next()
        }
    },
    createUserAccount: async (req, res, next) => {
        const email = req.body.email
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(email.split('@')[0], salt)
        const user = {
            username: email.split('@')[0],
            email,
            password: hash,
            fullName: req.body.fname + " " + req.body.lname,
            role: req.body.role,
            profilePicture: req.file.filename
        }

        User.create(user)
            .then(() => {
                // create jsonwebtoken
                const token = jwt.createJwt(req.body.email, email.split('@')[0], 60)

                // send mail verify
                main(req.body.email, token)

                res.status(201).json({ message: " Add user successfully!" })
            })
            .catch(error => {
                console.log(error)
                res.status(400).json({ message: " Add user failed!" })
            })
    },
    resendEmail: async (req, res, next) => {

        const token = jwt.createJwt(req.body.email, req.body.password, 60)
                // send mail verify
        try{
            main(req.body.email, token)
            res.status(201).json({ message: " Resend Email successfully!" })

        }catch(error){
            res.status(400).json({ message: " This email has been verify!" })

        }

        

    },
    signinUser: async (req, res, next) => {
        var email = req.body.email
        var pass = req.body.pass

        const comparePassword = (enteredPassword, hashedPassword) => {
            return new Promise((resolve, reject) => {
                bcrypt.compare(enteredPassword, hashedPassword, (err, res) => {
                    if (err) {
                        reject(err);
                    } else if (res) {
                        resolve(res);
                    } else {
                        reject(new Error(" Password isn't correct, please check then try again!"));
                    }
                })
            })
        }

        const user = await User.findOne({ email, lockedStatus : false })
        if (!user) {
            res.status(400).json({ message: " Email isn't correct, please check then try again! or account has been locked" })
            next()
        }
        else {

            await comparePassword(pass, user.password)
                .then(() => {
                    if (user.isVerified) {
                        const tokenExpirationInSeconds = 60 * 60;

                        jwt.createJwtAuth(
                            email,
                            tokenExpirationInSeconds,
                            function (err, token) {
                                if (err) {
                                    throw err;
                                }
                                // Set a cookie named 'token' with the JWT token
                                res.cookie('token', token, { maxAge: tokenExpirationInSeconds * 1000, httpOnly: true });
                                user.inactivateStatus = true
                                User.updateOne({ email: user.email }, user)
                                .then((user) => {
                                    req.session.user = user
                                    // res.status(200).json({ message: " Update successfully!" })
                                })
                                .catch(error => {
                                    // res.status(400).json({ message: error.message })
                                    next()
                                })
                                return res.status(200).json({
                                    code: 1,
                                    message: " Signin successfully!",
                                    token: token
                                })
                            })
                    }
                    else {
                        res.status(400).json({ message: " Email need verifying in the first time login, notification was sent to your email, please click into link to verify email!" })
                    }

                })
                .catch(error => {
                    console.log(error)
                    res.status(400).json({ message: error.message })
                    next()
                })
        }
    },
    updateUser: async (req, res, next) => {
        const user = {}
        if (req.file) {
            user.username = req.body.uname,
            user.fullName = req.body.fname
            user.profilePicture = req.file.filename
                
                
        }
        if(req.body.role){
            user.role = req.body.role
        }
        if (req.body.pass) {
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(req.body.npass, salt)
            user.password = hash
            user.isVerified = true
        }
        if (req.body.email) {
            user.email = req.body.email
        // console.log(user.email)
        }
         else {
             user.email = req.user.email
         }


        // console.log(user.email)
        
        

        await User.findOneAndUpdate({ email: user.email }, user)
            .then((user) => {
                req.session.user = user
                res.status(200).json({ message: " Update successfully!" })
            })
            .catch(error => {
                res.status(400).json({ message: error.message })
                next()
            })
    },
    updateLockedStatus: async (req, res) => {
        const { email } = req.params;
        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            user.lockedStatus = !user.lockedStatus;
            await user.save();

            res.json({ lockedStatus: user.lockedStatus });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

}

module.exports = userController