"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Index_1 = require("../models/Index");
const auth_1 = require("../middleware/auth");
const admin_1 = require("../middleware/admin");
const asyncHandler_1 = require("../middleware/asyncHandler");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.use(auth_1.auth);
router.use(admin_1.adminOnly);
router.get('/users', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const users = await Index_1.User.findAll({
        attributes: ['id', 'name', 'email', 'role', 'createdAt']
    });
    res.json(users);
}));
router.get('/users/:id', (0, validation_1.validate)(validation_1.userIdValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await Index_1.User.findByPk(req.params.id, {
        attributes: ['id', 'name', 'email', 'role', 'createdAt']
    });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
}));
router.delete('/users/:id', (0, validation_1.validate)(validation_1.userIdValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await Index_1.User.findByPk(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (user.role === 'admin') {
        return res.status(400).json({ message: 'Admins cannot delete other admins' });
    }
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
}));
router.get('/categories', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const categories = await Index_1.Category.findAll();
    res.json(categories);
}));
router.get('/categories/:id', (0, validation_1.validate)(validation_1.categoryIdValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const category = await Index_1.Category.findByPk(req.params.id);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
}));
router.post('/categories', (0, validation_1.validate)(validation_1.categoryValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const category = await Index_1.Category.create(req.body);
    res.status(201).json(category);
}));
router.put('/categories/:id', (0, validation_1.validate)([...validation_1.categoryIdValidation, ...validation_1.categoryValidation]), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const category = await Index_1.Category.findByPk(req.params.id);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }
    await category.update(req.body);
    res.json(category);
}));
router.delete('/categories/:id', (0, validation_1.validate)(validation_1.categoryIdValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const category = await Index_1.Category.findByPk(req.params.id);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }
    await category.destroy();
    res.json({ message: 'Category deleted successfully' });
}));
router.get('/subcategories', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const subcategories = await Index_1.Subcategory.findAll({
        include: [{ model: Index_1.Category, as: 'Category' }]
    });
    res.json(subcategories);
}));
router.get('/subcategories/:id', (0, validation_1.validate)(validation_1.subcategoryIdValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const subcategory = await Index_1.Subcategory.findByPk(req.params.id, {
        include: [{ model: Index_1.Category, as: 'Category' }]
    });
    if (!subcategory) {
        return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.json(subcategory);
}));
router.post('/subcategories', (0, validation_1.validate)(validation_1.subcategoryValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const subcategory = await Index_1.Subcategory.create(req.body);
    res.status(201).json(subcategory);
}));
router.put('/subcategories/:id', (0, validation_1.validate)([...validation_1.subcategoryIdValidation, ...validation_1.subcategoryValidation]), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const subcategory = await Index_1.Subcategory.findByPk(req.params.id);
    if (!subcategory) {
        return res.status(404).json({ message: 'Subcategory not found' });
    }
    await subcategory.update(req.body);
    res.json(subcategory);
}));
router.delete('/subcategories/:id', (0, validation_1.validate)(validation_1.subcategoryIdValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const subcategory = await Index_1.Subcategory.findByPk(req.params.id);
    if (!subcategory) {
        return res.status(404).json({ message: 'Subcategory not found' });
    }
    await subcategory.destroy();
    res.json({ message: 'Subcategory deleted successfully' });
}));
router.get('/products', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const products = await Index_1.Product.findAll({
        include: [
            { model: Index_1.Category, as: 'Category' },
            { model: Index_1.Subcategory, as: 'Subcategory' }
        ]
    });
    res.json(products);
}));
router.get('/products/:id', (0, validation_1.validate)(validation_1.productIdValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
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
}));
router.post('/products', (0, validation_1.validate)(validation_1.productValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const product = await Index_1.Product.create(req.body);
    res.status(201).json(product);
}));
router.put('/products/:id', (0, validation_1.validate)([...validation_1.productIdValidation, ...validation_1.productValidation]), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const product = await Index_1.Product.findByPk(req.params.id);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    await product.update(req.body);
    res.json(product);
}));
router.delete('/products/:id', (0, validation_1.validate)(validation_1.productIdValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const product = await Index_1.Product.findByPk(req.params.id);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
}));
router.get('/stats', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const totalUsers = await Index_1.User.count();
    const adminCount = await Index_1.User.count({ where: { role: 'admin' } });
    const userCount = await Index_1.User.count({ where: { role: 'user' } });
    const productCount = await Index_1.Product.count();
    const categoryCount = await Index_1.Category.count();
    const subcategoryCount = await Index_1.Subcategory.count();
    res.json({
        totalUsers,
        adminCount,
        userCount,
        productCount,
        categoryCount,
        subcategoryCount
    });
}));
exports.default = router;
