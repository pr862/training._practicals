"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Index_1 = require("../models/Index");
const auth_1 = require("../middleware/auth");
const admin_1 = require("../middleware/admin");
const asyncHandler_1 = require("../middleware/asyncHandler");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.get('/', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const subcategories = await Index_1.Subcategory.findAll({
        include: [{ model: Index_1.Category, as: 'Category' }]
    });
    res.json(subcategories);
}));
router.get('/:id', (0, validation_1.validate)(validation_1.subcategoryIdValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const subcategory = await Index_1.Subcategory.findByPk(req.params.id, {
        include: [{ model: Index_1.Category, as: 'Category' }]
    });
    if (!subcategory) {
        return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.json(subcategory);
}));
router.post('/', auth_1.auth, admin_1.adminOnly, (0, validation_1.validate)(validation_1.subcategoryValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const subcategory = await Index_1.Subcategory.create(req.body);
    res.status(201).json(subcategory);
}));
router.put('/:id', auth_1.auth, admin_1.adminOnly, (0, validation_1.validate)([...validation_1.subcategoryIdValidation, ...validation_1.subcategoryValidation]), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const subcategory = await Index_1.Subcategory.findByPk(req.params.id);
    if (!subcategory) {
        return res.status(404).json({ message: 'Subcategory not found' });
    }
    await subcategory.update(req.body);
    res.json(subcategory);
}));
router.delete('/:id', auth_1.auth, admin_1.adminOnly, (0, validation_1.validate)(validation_1.subcategoryIdValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const subcategory = await Index_1.Subcategory.findByPk(req.params.id);
    if (!subcategory) {
        return res.status(404).json({ message: 'Subcategory not found' });
    }
    await subcategory.destroy();
    res.json({ message: 'Subcategory deleted successfully' });
}));
exports.default = router;
