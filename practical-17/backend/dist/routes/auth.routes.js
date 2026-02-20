"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../models/User");
const email_1 = require("../utils/email");
const jwt_1 = require("../utils/jwt");
const asyncHandler_1 = require("../middleware/asyncHandler");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.post('/admin/signup', (0, validation_1.validate)(validation_1.adminSignupValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name, email, password } = req.body;
    const existing = await User_1.User.findOne({ where: { email } });
    if (existing) {
        return res.status(400).json({ message: 'Admin already exists' });
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const admin = await User_1.User.create({
        name,
        email,
        password: hashedPassword,
        role: 'admin'
    });
    const token = (0, jwt_1.generateToken)(admin.id, admin.role);
    res.status(201).json({
        token,
        user: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        }
    });
}));
router.post('/user/signup', (0, validation_1.validate)(validation_1.userSignupValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name, email, password } = req.body;
    const existing = await User_1.User.findOne({ where: { email } });
    if (existing) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await User_1.User.create({
        name,
        email,
        password: hashedPassword,
        role: 'user'
    });
    const token = (0, jwt_1.generateToken)(user.id, user.role);
    // Send welcome email asynchronously (non-blocking)
    (0, email_1.sendWelcomeEmail)(user.email, user.name).catch(err => console.error('Failed to send welcome email:', err));
    res.status(201).json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
}));
router.post('/login', (0, validation_1.validate)(validation_1.loginValidation), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const user = await User_1.User.findOne({ where: { email } });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = (0, jwt_1.generateToken)(user.id, user.role);
    res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
}));
exports.default = router;
