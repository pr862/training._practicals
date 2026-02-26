import { Router, Request, Response } from 'express';
import { Product, Category, Subcategory } from '../models/Index';
import { auth } from '../middleware/auth';
import { adminOnly } from '../middleware/admin';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  validate,
  productValidation,
  productIdValidation
} from '../middleware/validation';
import { uploadProductImage } from '../middleware/upload';
import path from 'path';
import fs from 'fs';

const router = Router();

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { categoryId, subcategoryId, search, minPrice, maxPrice, sortBy, sortOrder } = req.query;

  const where: any = {};

  if (categoryId) {
    where.categoryId = parseInt(categoryId as string);
  }

  if (subcategoryId) {
    where.subcategoryId = parseInt(subcategoryId as string);
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
      where.price[Op.gte] = parseFloat(minPrice as string);
    }
    if (maxPrice) {
      where.price[Op.lte] = parseFloat(maxPrice as string);
    }
  }

  const order: any[] = [];
  if (sortBy) {
    const validSortFields = ['name', 'price', 'createdAt', 'stock'];
    if (validSortFields.includes(sortBy as string)) {
      const sortDirection = sortOrder === 'DESC' ? 'DESC' : 'ASC';
      order.push([sortBy as string, sortDirection]);
    }
  } else {
    order.push(['createdAt', 'DESC']);
  }

  const products = await Product.findAll({
    where,
    order,
    include: [
      { model: Category, as: 'Category' },
      { model: Subcategory, as: 'Subcategory' }
    ]
  });
  res.json(products);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id, {
    include: [
      { model: Category, as: 'Category' },
      { model: Subcategory, as: 'Subcategory' }
    ]
  });
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
}));

router.get('/:id/image', asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  if (!product.image) {
    return res.status(404).json({ message: 'Image not found' });
  }
  
  const imagePath = path.join(__dirname, '../../', product.image);
  
  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ message: 'Image file not found' });
  }
  
  res.sendFile(imagePath);
}));

router.get('/category/:categoryId/subcategories', asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const subcategories = await Subcategory.findAll({
    where: { categoryId: parseInt(categoryId) },
    include: [{ model: Category, as: 'Category' }]
  });
  res.json(subcategories);
}));

router.get('/category/:categoryId/products', asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const products = await Product.findAll({
    where: { categoryId: parseInt(categoryId) },
    include: [
      { model: Category, as: 'Category' },
      { model: Subcategory, as: 'Subcategory' }
    ]
  });
  res.json(products);
}));

router.get('/subcategory/:subcategoryId/products', asyncHandler(async (req, res) => {
  const { subcategoryId } = req.params;
  const products = await Product.findAll({
    where: { subcategoryId: parseInt(subcategoryId) },
    include: [
      { model: Category, as: 'Category' },
      { model: Subcategory, as: 'Subcategory' }
    ]
  });
  res.json(products);
}));

router.get('/search', asyncHandler(async (req: Request, res: Response) => {
  const { q, minPrice, maxPrice, categoryId, limit = 10 } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  const { Op } = require('sequelize');
  
  const where: any = {
    [Op.or]: [
      { name: { [Op.iLike]: `%${q}%` } }
    ]
  };

  if (minPrice || maxPrice) {
    if (minPrice && maxPrice) {
      where.price = {
        [Op.between]: [parseFloat(minPrice as string), parseFloat(maxPrice as string)]
      };
    } else if (minPrice) {
      where.price = {
        [Op.gte]: parseFloat(minPrice as string)
      };
    } else if (maxPrice) {
      where.price = {
        [Op.lte]: parseFloat(maxPrice as string)
      };
    }
  }

  if (categoryId) {
    where.categoryId = parseInt(categoryId as string);
  }

  const products = await Product.findAll({
    where,
    limit: parseInt(limit as string),
    include: [
      { model: Category, as: 'Category' },
      { model: Subcategory, as: 'Subcategory' }
    ]
  });

  res.json({
    count: products.length,
    products
  });
}));

router.post('/',
  auth,
  adminOnly,
  uploadProductImage,
  asyncHandler(async (req, res) => {
    const productData: any = {
      ...req.body,
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock),
      categoryId: parseInt(req.body.categoryId),
      subcategoryId: parseInt(req.body.subcategoryId),
    };
    
    if (req.file) {
      productData.image = `/uploads/${req.file.filename}`;
    }
    
    const product = await Product.create(productData);
    res.status(201).json(product);
  })
);

router.put('/:id',
  auth,
  adminOnly,
  uploadProductImage,
  asyncHandler(async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const updateData: any = {
      ...req.body,
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock),
      categoryId: parseInt(req.body.categoryId),
      subcategoryId: parseInt(req.body.subcategoryId),
    };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    
    await product.update(updateData);
    res.json(product);
  })
);

router.delete('/:id',
  auth,
  adminOnly,
  validate(productIdValidation),
  asyncHandler(async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  })
);

export default router;
