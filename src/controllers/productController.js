const Product = require("../models/Product");
const Category = require("../models/Category");
const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const ProductError = require("../errors/ProductError");

const publicImagesDirectory = path.join(__dirname, "../", "public", "images", "product");

const { createCanvas, registerFont } = require('canvas');
const jsbarcode = require('jsbarcode')

const productController = {

    getAllProducts: async (req, res, next) => {
        try {
            let filter = {};
            const { name, category } = req.query;
            if (name) {
                filter.productName = { $regex: name, $options: 'i' };
            }
            if (category) {
                filter.category = await Category
                    .findOne({ name: category })
                    .lean()
                    .exec();
            }
            const product = await Product
                .find(filter)
                .lean()
                .populate('category')
                .exec();
            if (!product) {
                return res.status(200).json({
                    code: 1,
                    message: "Not found product"
                })
            }
            res.status(200).json({
                code: 1,
                message: "successfully",
                data: product
            });
        } catch (error) {
            next(error);
        }
    },

    getProductById: async (req, res, next) => {
        const id = req.params.id;
        try {
            const p = await Product.findById(id);
            if (!p) {
                throw new ProductError('Not found product', 404)
            }
            return res.status(200).json({
                code: 1,
                message: `Successfully`,
                data: p,
            });
        } catch (err) {
            next(err);
        }
    },

    postAddProduct: async (req, res, next) => {
        try {
            let result = validationResult(req);
            if (result.errors.length !== 0) {
                result = result.mapped();
                let msg = "";
                for (let fields in result) {
                    msg = result[fields].msg;
                    break;
                }
                next(new ProductError(msg));
                return;
            }

            const { productName, barcode, category, importPrice, retailPrice } =
                req.body;
            const files = req.file;

            const existingProduct = await Product.findOne({
                $or: [{ barcode }, { productName }],
            });
            if (existingProduct) {
                throw new ProductError("Exist Product", 400);
            }

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


            const newProduct = new Product({
                productName,
                barcode: imgBase64,
                category,
                importPrice,
                retailPrice,
                images: files.filename,
            });

            const savedProduct = await newProduct.save();
            if (savedProduct) {
                return res.status(201).json({
                    code: 1,
                    message: "Product added successfully",
                    data: savedProduct,
                });
            }

        } catch (error) {
            next(error);
        }
    },

    updateProduct: async (req, res, next) => {
        try {
            let result = validationResult(req);
            if (result.errors.length !== 0) {
                result = result.mapped();
                let msg = "";
                for (let fields in result) {
                    msg = result[fields].msg;
                    break;
                }
                next(new ProductError(msg, 404));
                return;
            }

            const { id } = req.params;
            const files = req.file;
            const { productName, barcode, category, importPrice, retailPrice } =
                req.body;
            const existP = await Product.findById(id);

            if (!existP) {
                throw new ProductError("Product not found", 404);
            }

            // if (existP.images) {
            //     try {
            //         fs.unlinkSync(publicImagesDirectory + "/" + existP.images);
            //     } catch (err) {
            //         next(err);
            //     }
            // }

            const updatedProduct = {
                productName,
                barcode,
                category,
                importPrice,
                retailPrice,
            };

            if (files) {
                updatedProduct.images =   files.filename   
            }

            
            const product = await Product.findByIdAndUpdate(id, updatedProduct, {
                new: true,
            });

            return res.status(200).json({
                code: 1,
                message: "Update successfully",
                data: product,
            });
        } catch (error) {
            next(new ProductError(error.message));
        }
    },

    deleteProduct: async (req, res, next) => {
        const id = req.params.id;
        try {
            const p = await Product.findByIdAndDelete(id);
            if (!p) {
                return res.status(404).json({
                    code: 1,
                    message: "Product not found",
                });
            }
            if (p.images) {
                try {
                    fs.unlinkSync(publicImagesDirectory + "/" + p.images);
                } catch (error) {
                    throw error
                }
            }
            res.status(200).json({
                code: 0,
                message: "Delete Successfully",
            });
        } catch (error) {
            next(error);
        }
    },
};
module.exports = productController;
