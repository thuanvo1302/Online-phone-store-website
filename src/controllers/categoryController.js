const Category = require('../models/Category');

const categoryController = {
    // get all category
    getAllCategory: async (req, res) => {
        try {
            const categories = await Category.find().lean();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    // add the category
    addCategory: async (req, res) => {
        try {
            const category = new Category(req.body);
            const savedCategory = await category.save();
            res.status(200).json(savedCategory);
        } catch (error) {
            res.status(500).json(error)
        }
    },
    // update the category
    updateCategory: async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            await category.updateOne({ $set: req.body });
            res.status(200).json({ code: 0, message: "update successfully" });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    // delete the category  
    deleteCategory: async (req, res) => {
        try {
            const categories = await Category.findById(req.params.id)
            await categories.deleteOne()
            res.status(200).json({ code: 0, message: "delete successfully" });
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

module.exports = categoryController; 