var express = require('express');
var router = express.Router();

const { createCanvas, registerFont } = require('canvas');
const jsbarcode = require('jsbarcode')

const Product = require('../models/Product')
const productController = require('../controllers/productController')

const upload = require('../middleware/multipleUploadMiddleware')

const ProductError = require('../errors/ProductError');

const ProductValidator = require('../validators/ProductValidator')

// middleware


router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById)
router.post('/', upload.single('files', 10), ProductValidator, productController.postAddProduct);
router.put('/:id', upload.single('files', 10), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.post('/search/barcode', async (req, res, next) => {
    const { barcodeProduct } = req.body;
    console.log(barcodeProduct);
    try {
        if (barcodeProduct) {
            const product = await Product.find({
                barcode: barcodeProduct
            })
            if (product) {
                return res.status(200).json({
                    code: 1,
                    status: true,
                    message: "successfully",
                    data: product
                });
            }
        }
        return res.status(200).json({
            code: 1,
            status: true,
            message: "successfully",
        });
    } catch (err) {
        next(err)
    }

})


router.post('/barcode/generate/:barcode', async (req, res, next) => {
    try {
        const { barcode } = req.params;
        const canvas = new createCanvas();
        jsbarcode(canvas, barcode, {
            lineColor: "black",
            width: 2,
            height: '80px',
            displayValue: false
        });

        let imgBase64 = await new Promise((resolve, reject) => {
            canvas.toDataURL('image/png', (err, imgBase64) => {
                if (err) {
                    reject(reject);
                    return;
                }
                resolve(imgBase64);
            });
        });
        return res.status(200).json({
            code: 1,
            status: true,
            message: "Sucesssfully",
            imgBase64: imgBase64,
        })
    } catch (error) {
        next(error)
    }
})

router.get('/barcode/generate/:barcode', async (req, res, next) => {
    try {
        const { barcode } = req.params;
        const canvas = new createCanvas();
        jsbarcode(canvas, barcode, {
            lineColor: "black",
            width: 2,
            height: '80px',
            displayValue: false
        });

        let imgBase64 = await new Promise((resolve, reject) => {
            canvas.toDataURL('image/png', (err, imgBase64) => {
                if (err) {
                    reject(reject);
                    return;
                }
                resolve(imgBase64);
            });
        });
        res.header('Content-Disposition', `inline; filename="file.png"`);
        res.setHeader('Content-type', 'image/png');
        const pdfBuffer = Buffer.from(`${imgBase64}`.replace('data:image/png;base64,', ''), 'base64');
        return res.send(pdfBuffer);
    } catch (error) {
        next(error)
    }
})

router.use((err, req, res, next) => {
    if (err instanceof ProductError) {
        res.status(err.statusCode).json({
            code: 0,
            statusCode: err.statusCode,
            message: err.message
        });
    } else {
        next(err);
    }
});

module.exports = router;

