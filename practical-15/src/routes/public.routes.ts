import { Router, Request, Response } from 'express';
import { Category, Subcategory, Product, User } from '../models/Index';

const router = Router();

router.get('/categories', async (_, res) => {
  try {
    const data = await Category.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

router.get('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category' });
  }
});

router.get('/subcategories', async (_, res) => {
  try {
    const data = await Subcategory.findAll({
      include: [{ model: Category, as: 'Category' }]
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subcategories' });
  }
});

router.get('/subcategories/:id', async (req, res) => {
  try {
    const subcategory = await Subcategory.findByPk(req.params.id, {
      include: [{ model: Category, as: 'Category' }]
    });
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.json(subcategory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subcategory' });
  }
});

router.get('/products', async (req: Request, res: Response) => {
  try {
    const { categoryId, subcategoryId, search, minPrice, maxPrice,sortBy,sortOrder  } = req.query;

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
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
});
router.get('/categories/:categoryId/subcategories', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subcategories = await Subcategory.findAll({
      where: { categoryId: parseInt(categoryId) },
      include: [{ model: Category, as: 'Category' }]
    });
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subcategories' });
  }
});

router.get('/categories/:categoryId/products', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.findAll({
      where: { categoryId: parseInt(categoryId) },
      include: [
        { model: Category, as: 'Category' },
        { model: Subcategory, as: 'Subcategory' }
      ]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

router.get('/subcategories/:subcategoryId/products', async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    const products = await Product.findAll({
      where: { subcategoryId: parseInt(subcategoryId) },
      include: [
        { model: Category, as: 'Category' },
        { model: Subcategory, as: 'Subcategory' }
      ]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});


router.get('/search', async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Error searching products' });
  }
});

export default router;

