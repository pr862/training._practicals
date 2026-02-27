"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackValidation = exports.userIdValidation = exports.productIdValidation = exports.productValidation = exports.categoryIdValidation = exports.categoryValidation = exports.loginValidation = exports.signupValidation = exports.validate = void 0;
const express_validator_1 = require("express-validator");
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        const extractedErrors = errors.array().map(err => ({
            field: 'path' in err ? err.path : 'unknown',
            message: err.msg
        }));
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: extractedErrors
        });
    };
};
exports.validate = validate;
exports.signupValidation = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain at least one number'),
    (0, express_validator_1.body)('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Role must be either "user" or "admin"')
];
exports.loginValidation = [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
];
exports.categoryValidation = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Category name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('parent_id')
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage('Valid parent category ID is required')
];
exports.categoryIdValidation = [
    (0, express_validator_1.param)('id')
        .isInt({ min: 1 })
        .withMessage('Valid category ID is required')
];
exports.productValidation = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Product name must be between 2 and 100 characters'),
    (0, express_validator_1.body)('price')
        .isFloat({ min: 0.01 })
        .withMessage('Price must be a positive number'),
    (0, express_validator_1.body)('stock')
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
    (0, express_validator_1.body)('categoryId')
        .isInt({ min: 1 })
        .withMessage('Valid category ID is required')
];
exports.productIdValidation = [
    (0, express_validator_1.param)('id')
        .isInt({ min: 1 })
        .withMessage('Valid product ID is required')
];
exports.userIdValidation = [
    (0, express_validator_1.param)('id')
        .isInt({ min: 1 })
        .withMessage('Valid user ID is required')
];
exports.feedbackValidation = [
    (0, express_validator_1.body)('subject')
        .trim()
        .notEmpty()
        .withMessage('Subject is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Subject must be between 3 and 100 characters'),
    (0, express_validator_1.body)('message')
        .trim()
        .notEmpty()
        .withMessage('Message is required')
        .isLength({ min: 10, max: 2000 })
        .withMessage('Message must be between 10 and 2000 characters')
];
