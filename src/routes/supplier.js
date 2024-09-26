var express = require('express');
var router = express.Router();

/* GET list Supplier   . */
router.get('/', (req, res) => {
    res.render('page-list-suppliers', { title: 'Trang nhà cung cấp' })
});

/* GET detail order  */
router.get('/add', (req, res) => {
    res.render('page-add-supplier', { title: 'Trang thêm nhà cung cấp' })
});

module.exports = router;
