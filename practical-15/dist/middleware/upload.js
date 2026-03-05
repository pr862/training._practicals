"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProductImage = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.split('.').pop()?.toLowerCase() || '');
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
};
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: {
        folder: 'products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        public_id: (_req, _file) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            return `product-${uniqueSuffix}`;
        }
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter,
});
exports.uploadProductImage = exports.upload.single('image');
