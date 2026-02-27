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
router.get('/', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const categories = await Index_1.Category.findAll();
    res.json(categories);
}));
router.get('/:id/subcategories', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const subcategories = await Index_1.Category.findAll({
        where: { parent_id: parseInt(req.params.id) }
    });
    res.json(subcategories);
}));
router.get('/:id', (0, validation_1.validate)(validation_1.categoryIdValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const category = await Index_1.Category.findByPk(req.params.id);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
}));
router.post('/', auth_1.auth, admin_1.adminOnly, (0, validation_1.validate)(validation_1.categoryValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const category = await Index_1.Category.create(req.body);
    res.status(201).json(category);
}));
router.put('/:id', auth_1.auth, admin_1.adminOnly, (0, validation_1.validate)([...validation_1.categoryIdValidation, ...validation_1.categoryValidation]), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const category = await Index_1.Category.findByPk(req.params.id);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }
    await category.update(req.body);
    res.json(category);
}));
router.delete('/:id', auth_1.auth, admin_1.adminOnly, (0, validation_1.validate)(validation_1.categoryIdValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const category = await Index_1.Category.findByPk(req.params.id);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }
    await category.destroy();
    res.json({ message: 'Category deleted successfully' });
}));
exports.default = router;
