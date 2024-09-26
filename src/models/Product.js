const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    barcode: {
        type: String, require: true, unique: true,
    },
    productName: {
        type: String,
        unique: true,
        required: true,
    },
    importPrice: {
        type: Number,
        required: true,
    },
    retailPrice: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    images: {
        type: String
    }
}, { timestamps: true });

// productSchema.index({ barcode: 1, productName: 1 });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

