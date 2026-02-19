import { body, param, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
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

export const signupValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
];

export const adminSignupValidation = signupValidation;
export const userSignupValidation = signupValidation;

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters')
];

export const categoryIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid category ID is required')
];

export const subcategoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Subcategory name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Subcategory name must be between 2 and 50 characters'),

  body('categoryId')
    .isInt({ min: 1 })
    .withMessage('Valid category ID is required')
];

export const subcategoryIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid subcategory ID is required')
];

export const productValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),

  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number'),

  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),

  body('categoryId')
    .isInt({ min: 1 })
    .withMessage('Valid category ID is required'),

  body('subcategoryId')
    .isInt({ min: 1 })
    .withMessage('Valid subcategory ID is required')
];

export const productIdValidation = [
  param('productId')
    .isInt({ min: 1 })
    .withMessage('Valid product ID is required')
];

export const userIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid user ID is required')
];

export const feedbackValidation = [
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Subject must be between 3 and 100 characters'),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
];

