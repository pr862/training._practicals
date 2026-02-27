"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Index_1 = require("../models/Index");
const auth_1 = require("../middleware/auth");
const admin_1 = require("../middleware/admin");
const asyncHandler_1 = require("../middleware/asyncHandler");
const validation_1 = require("../middleware/validation");
const upload_1 = require("../middleware/upload");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
router.use(auth_1.auth);
router.get('/', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { categoryId, search, minPrice, maxPrice, sortBy, sortOrder } = req.query;
    const where = {};
    if (categoryId) {
        where.categoryId = parseInt(categoryId);
    }
    if (search) {
        const { Op } = require('sequelize');
        where[Op.or] = [
            { name: { [Op.iLike]: `%${search}%` } }
        ];
    }
    if (minPrice || maxPrice) {
        const { Op } = require('sequelize');
        where.price = {};
        if (minPrice) {
            where.price[Op.gte] = parseFloat(minPrice);
        }
        if (maxPrice) {
            where.price[Op.lte] = parseFloat(maxPrice);
        }
    }
    const order = [];
    if (sortBy) {
        const validSortFields = ['name', 'price', 'createdAt', 'stock'];
        if (validSortFields.includes(sortBy)) {
            const sortDirection = sortOrder === 'DESC' ? 'DESC' : 'ASC';
            order.push([sortBy, sortDirection]);
        }
    }
    else {
        order.push(['createdAt', 'DESC']);
    }
    const products = await Index_1.Product.findAll({
        where,
        order,
        include: [
            { model: Index_1.Category, as: 'Category' }
        ]
    });
    res.json(products);
}));
router.get('/:id', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const product = await Index_1.Product.findByPk(req.params.id, {
        include: [
            { model: Index_1.Category, as: 'Category' }
        ]
    });
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
}));
router.get('/:id/image', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const product = await Index_1.Product.findByPk(req.params.id);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    if (!product.image) {
        return res.status(404).json({ message: 'Image not found' });
    }
    const imagePath = path_1.default.join(__dirname, '../../', product.image);
    if (!fs_1.default.existsSync(imagePath)) {
        return res.status(404).json({ message: 'Image file not found' });
    }
    res.sendFile(imagePath);
}));
router.get('/category/:categoryId/products', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { categoryId } = req.params;
    const products = await Index_1.Product.findAll({
        where: { categoryId: parseInt(categoryId) },
        include: [
            { model: Index_1.Category, as: 'Category' }
        ]
    });
    res.json(products);
}));
router.get('/subcategory/:subcategoryId/products', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { subcategoryId } = req.params;
    const subcategory = await Index_1.Category.findByPk(parseInt(subcategoryId));
    if (!subcategory) {
        return res.status(404).json({ message: 'Subcategory not found' });
    }
    if (!subcategory.parent_id) {
        return res.status(400).json({ message: 'The provided ID is a main category, not a subcategory' });
    }
    const products = await Index_1.Product.findAll({
        where: { categoryId: parseInt(subcategoryId) },
        include: [
            { model: Index_1.Category, as: 'Category' }
        ]
    });
    res.json(products);
}));
router.get('/search', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { q, minPrice, maxPrice, categoryId, limit = 10 } = req.query;
    if (!q) {
        return res.status(400).json({ message: 'Search query is required' });
    }
    const { Op } = require('sequelize');
    const where = {
        [Op.or]: [
            { name: { [Op.iLike]: `%${q}%` } }
        ]
    };
    if (minPrice || maxPrice) {
        if (minPrice && maxPrice) {
            where.price = {
                [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)]
            };
        }
        else if (minPrice) {
            where.price = {
                [Op.gte]: parseFloat(minPrice)
            };
        }
        else if (maxPrice) {
            where.price = {
                [Op.lte]: parseFloat(maxPrice)
            };
        }
    }
    if (categoryId) {
        where.categoryId = parseInt(categoryId);
    }
    const products = await Index_1.Product.findAll({
        where,
        limit: parseInt(limit),
        include: [
            { model: Index_1.Category, as: 'Category' }
        ]
    });
    res.json({
        count: products.length,
        products
    });
}));
router.post('/', auth_1.auth, admin_1.adminOnly, upload_1.uploadProductImage, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const productData = {
        ...req.body,
        price: parseFloat(req.body.price),
        stock: parseInt(req.body.stock),
        categoryId: parseInt(req.body.categoryId),
    };
    if (req.file) {
        productData.image = `/uploads/${req.file.filename}`;
    }
    const product = await Index_1.Product.create(productData);
    res.status(201).json(product);
}));
router.put('/:id', auth_1.auth, admin_1.adminOnly, upload_1.uploadProductImage, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const product = await Index_1.Product.findByPk(req.params.id);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    const updateData = {
        ...req.body,
        price: parseFloat(req.body.price),
        stock: parseInt(req.body.stock),
        categoryId: parseInt(req.body.categoryId),
    };
    if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
    }
    await product.update(updateData);
    res.json(product);
}));
router.delete('/:id', auth_1.auth, admin_1.adminOnly, (0, validation_1.validate)(validation_1.productIdValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const product = await Index_1.Product.findByPk(req.params.id);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
}));
exports.default = router;
