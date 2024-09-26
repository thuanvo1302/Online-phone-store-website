var express = require('express');
var router = express.Router();

const isAuthenticated = require('../middleware/authentication')

/* GET home page. */
router.get('/', isAuthenticated,  function (req, res, next) {
  res.render('index', { title: 'Trang chủ' });
});

router.get('/login', (req, res) => {
  res.render('auth-sign-in', { title: 'Sign In' })
})

module.exports = router;
