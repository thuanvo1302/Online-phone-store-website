var express = require('express');
var router = express.Router();

//middleware 
const isAuthenticated = require('../middleware/authentication');

//model
const User = require('../models/User');
// get current user 
router.get('/user', isAuthenticated, async (req, res) => {
    try {
        // console.log(req.user)

        const { email } = req.user
        const user = await User.findOne({ email });
        return res.json({
            code: 1,
            status: true,
            data: user
        })
    } catch (error) {
        return res.json({ error: error });
    }
})

router.post('/logout', isAuthenticated, async (req, res) => {
    const { email } = req.user;
        try {
            await User.findOneAndUpdate({ email }, {inactivateStatus: false})
            .then(user => {
                
            })

            // res.json({ lockedStatus: user.lockedStatus });
        } catch (error) {
            console.error(error);
            // res.status(500).json({ error: 'Internal Server Error' });
        }
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({
                code: 1,
                message: 'Logout failed'
            });
        }
        res.clearCookie('token')
        res.status(200).json({
            code: 1,
            status: true,
            message: 'Logout successful'
        });
    });
})
module.exports = router