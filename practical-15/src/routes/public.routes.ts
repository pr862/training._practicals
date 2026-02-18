import { Router } from 'express';
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

router.get('/products', async (req, res) => {
  try {
    const { categoryId, subcategoryId, search } = req.query;

    const where: any = {};

    if (categoryId) {
      where.categoryId = parseInt(categoryId as string);
    }

    if (subcategoryId) {
      where.subcategoryId = parseInt(subcategoryId as string);
    }

    if (search) {
      where[require('sequelize').Op.or] = [
        { name: { [require('sequelize').Op.iLike]: `%${search}%` } },
        { description: { [require('sequelize').Op.iLike]: `%${search}%` } }
      ];
    }

    const products = await Product.findAll({
      where,
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

export default router;

