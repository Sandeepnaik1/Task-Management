const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    try {
        const category = new Category({ name: req.body.name, user: req.session.userId });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Error creating category' });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ user: req.session.userId });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching categories' });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting category' });
    }
};
