"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Index_1 = require("../models/Index");
const auth_1 = require("../middleware/auth");
const asyncHandler_1 = require("../middleware/asyncHandler");
const validation_1 = require("../middleware/validation");
const feedbackEmail_1 = require("../utils/feedbackEmail");
const router = (0, express_1.Router)();
router.use(auth_1.auth);
router.get('/favorites', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const favorites = await Index_1.UserFavorite.findAll({
        where: { userId },
        include: [
            {
                model: Index_1.Product,
                as: 'Product',
                include: [
                    { model: Index_1.Category, as: 'Category' },
                ]
            }
        ]
    });
    const products = favorites.map(fav => fav.Product);
    res.json(products);
}));
router.post('/favorites/:id', (0, validation_1.validate)(validation_1.productIdValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const { id: productId } = req.params;
    const product = await Index_1.Product.findByPk(productId);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    const existingFavorite = await Index_1.UserFavorite.findOne({
        where: { userId, productId: parseInt(productId) }
    });
    if (existingFavorite) {
        return res.status(400).json({ message: 'Product already in favorites' });
    }
    const favorite = await Index_1.UserFavorite.create({
        userId,
        productId: parseInt(productId)
    });
    res.status(201).json({ message: 'Product added to favorites', favorite });
}));
router.delete('/favorites/:id', (0, validation_1.validate)(validation_1.productIdValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const { id: productId } = req.params;
    const favorite = await Index_1.UserFavorite.findOne({
        where: { userId, productId: parseInt(productId) }
    });
    if (!favorite) {
        return res.status(404).json({ message: 'Product not in favorites' });
    }
    await favorite.destroy();
    res.json({ message: 'Product removed from favorites' });
}));
router.get('/favorites/:id/check', (0, validation_1.validate)(validation_1.productIdValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const { id: productId } = req.params;
    const favorite = await Index_1.UserFavorite.findOne({
        where: { userId, productId: parseInt(productId) }
    });
    res.json({ isFavorited: !!favorite });
}));
router.post('/feedback', (0, validation_1.validate)(validation_1.feedbackValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const { subject, message } = req.body;
    const user = await Index_1.User.findByPk(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    await (0, feedbackEmail_1.sendFeedbackEmail)({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        subject,
        message
    });
    res.status(200).json({
        success: true,
        message: 'Feedback sent successfully. Thank you for your input!'
    });
}));
router.get('/profile', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const user = await Index_1.User.findByPk(userId, {
        attributes: ['id', 'name', 'email', 'role', 'createdAt']
    });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const favoriteCount = await Index_1.UserFavorite.count({ where: { userId } });
    res.json({
        ...user.toJSON(),
        favoriteCount
    });
}));
router.put('/profile', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const { name, email } = req.body;
    const user = await Index_1.User.findByPk(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (email && email !== user.email) {
        const existingUser = await Index_1.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
    }
    await user.update({ name, email });
    res.json({
        message: 'Profile updated successfully',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
}));
exports.default = router;
