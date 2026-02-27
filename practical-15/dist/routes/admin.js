"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Index_1 = require("../models/Index");
const Index_2 = require("../models/Index");
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
router.get('/analytics', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const totalUsers = await Index_1.User.count();
    const adminCount = await Index_1.User.count({ where: { role: 'admin' } });
    const userCount = await Index_1.User.count({ where: { role: 'user' } });
    const productCount = await Index_2.Product.count();
    const categoryCount = await Index_2.Category.count();
    res.json({
        totalUsers,
        adminCount,
        userCount,
        productCount,
        categoryCount
    });
}));
exports.default = router;
