const { check } = require('express-validator')
module.exports = [
    check('barcode').exists().withMessage('Please enter barcode!')
        .notEmpty().withMessage('Barcode not empty')
        .isString().withMessage('Barcode must be a string'),

    check('productName').exists().withMessage('Please enter product name!')
        .notEmpty().withMessage('Product name not empty')
        .isString().withMessage('Product name must be a string'),

    check('importPrice').exists().withMessage('Please enter import price!')
        .notEmpty().withMessage('Import price not empty')
        .isNumeric().withMessage('Import price must be a number'),

    check('retailPrice').exists().withMessage('Please enter retail price!')
        .notEmpty().withMessage('Retail price not empty')
        .isNumeric().withMessage('Retail price must be a number'),
]