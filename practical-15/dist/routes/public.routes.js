"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Index_1 = require("../models/Index");
const router = (0, express_1.Router)();
router.get('/categories', async (_, res) => {
    try {
        const data = await Index_1.Category.findAll();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching categories' });
    }
});
router.get('/categories/:id', async (req, res) => {
    try {
        const category = await Index_1.Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching category' });
    }
});
router.get('/subcategories', async (_, res) => {
    try {
        const data = await Index_1.Subcategory.findAll({
            include: [{ model: Index_1.Category, as: 'Category' }]
        });
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching subcategories' });
    }
});
router.get('/subcategories/:id', async (req, res) => {
    try {
        const subcategory = await Index_1.Subcategory.findByPk(req.params.id, {
            include: [{ model: Index_1.Category, as: 'Category' }]
        });
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        res.json(subcategory);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching subcategory' });
    }
});
router.get('/products', async (req, res) => {
    try {
        const { categoryId, subcategoryId, search } = req.query;
        const where = {};
        if (categoryId) {
            where.categoryId = parseInt(categoryId);
        }
        if (subcategoryId) {
            where.subcategoryId = parseInt(subcategoryId);
        }
        if (search) {
            where[require('sequelize').Op.or] = [
                { name: { [require('sequelize').Op.iLike]: `%${search}%` } },
                { description: { [require('sequelize').Op.iLike]: `%${search}%` } }
            ];
        }
        const products = await Index_1.Product.findAll({
            where,
            include: [
                { model: Index_1.Category, as: 'Category' },
                { model: Index_1.Subcategory, as: 'Subcategory' }
            ]
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
});
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Index_1.Product.findByPk(req.params.id, {
            include: [
                { model: Index_1.Category, as: 'Category' },
                { model: Index_1.Subcategory, as: 'Subcategory' }
            ]
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
});
exports.default = router;
