"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Index_1 = require("../models/Index");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
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
router.get('/categories/tree', async (_, res) => {
    try {
        const categories = await Index_1.Category.findAll();
        const buildTree = (parentId) => {
            return categories
                .filter(cat => cat.parent_id === parentId)
                .map(cat => ({
                ...cat.toJSON(),
                children: buildTree(cat.id)
            }));
        };
        const tree = buildTree(null);
        res.json(tree);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching category tree' });
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
router.get('/categories/:id/subcategories', async (req, res) => {
    try {
        const subcategories = await Index_1.Category.findAll({
            where: { parent_id: parseInt(req.params.id) }
        });
        res.json(subcategories);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching subcategories' });
    }
});
router.get('/products', async (req, res) => {
    try {
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
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Index_1.Product.findByPk(req.params.id, {
            include: [
                { model: Index_1.Category, as: 'Category' }
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
router.get('/products/:id/image', async (req, res) => {
    try {
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching product image' });
    }
});
router.get('/categories/:categoryId/products', async (req, res) => {
    try {
        const { categoryId } = req.params;
        const products = await Index_1.Product.findAll({
            where: { categoryId: parseInt(categoryId) },
            include: [
                { model: Index_1.Category, as: 'Category' }
            ]
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
});
router.get('/search', async (req, res) => {
    try {
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
    }
    catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Error searching products' });
    }
});
exports.default = router;
