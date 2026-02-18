import { Router } from 'express';
import { Category, Subcategory, Product, User } from '../models/Index';
import { auth } from '../middleware/auth';
import { adminOnly } from '../middleware/admin';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  validate,
  categoryValidation,
  categoryIdValidation,
  subcategoryValidation,
  subcategoryIdValidation,
  productValidation,
  productIdValidation,
  userIdValidation
} from '../middleware/validation';

const router = Router();

router.use(auth);
router.use(adminOnly);



router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email', 'role', 'createdAt']
  });
  res.json(users);
}));

router.get('/users/:id',
  validate(userIdValidation),
  asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'role', 'createdAt']
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  })
);

router.delete('/users/:id',
  validate(userIdValidation),
  asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Admins cannot delete other admins' });
    }
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  })
);


router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await Category.findAll();
  res.json(categories);
}));

router.get('/categories/:id',
  validate(categoryIdValidation),
  asyncHandler(async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  })
);

router.post('/categories',
  validate(categoryValidation),
  asyncHandler(async (req, res) => {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  })
);

router.put('/categories/:id',
  validate([...categoryIdValidation, ...categoryValidation]),
  asyncHandler(async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await category.update(req.body);
    res.json(category);
  })
);

router.delete('/categories/:id',
  validate(categoryIdValidation),
  asyncHandler(async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await category.destroy();
    res.json({ message: 'Category deleted successfully' });
  })
);


router.get('/subcategories', asyncHandler(async (req, res) => {
  const subcategories = await Subcategory.findAll({
    include: [{ model: Category, as: 'Category' }]
  });
  res.json(subcategories);
}));

router.get('/subcategories/:id',
  validate(subcategoryIdValidation),
  asyncHandler(async (req, res) => {
    const subcategory = await Subcategory.findByPk(req.params.id, {
      include: [{ model: Category, as: 'Category' }]
    });
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.json(subcategory);
  })
);

router.post('/subcategories',
  validate(subcategoryValidation),
  asyncHandler(async (req, res) => {
    const subcategory = await Subcategory.create(req.body);
    res.status(201).json(subcategory);
  })
);

router.put('/subcategories/:id',
  validate([...subcategoryIdValidation, ...subcategoryValidation]),
  asyncHandler(async (req, res) => {
    const subcategory = await Subcategory.findByPk(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    await subcategory.update(req.body);
    res.json(subcategory);
  })
);

router.delete('/subcategories/:id',
  validate(subcategoryIdValidation),
  asyncHandler(async (req, res) => {
    const subcategory = await Subcategory.findByPk(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    await subcategory.destroy();
    res.json({ message: 'Subcategory deleted successfully' });
  })
);


router.get('/products', asyncHandler(async (req, res) => {
  const products = await Product.findAll({
    include: [
      { model: Category, as: 'Category' },
      { model: Subcategory, as: 'Subcategory' }
    ]
  });
  res.json(products);
}));

router.get('/products/:id',
  validate(productIdValidation),
  asyncHandler(async (req, res) => {
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
  })
);

router.post('/products',
  validate(productValidation),
  asyncHandler(async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  })
);

router.put('/products/:id',
  validate([...productIdValidation, ...productValidation]),
  asyncHandler(async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.update(req.body);
    res.json(product);
  })
);

router.delete('/products/:id',
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


router.get('/stats', asyncHandler(async (req, res) => {
  const totalUsers = await User.count();
  const adminCount = await User.count({ where: { role: 'admin' } });
  const userCount = await User.count({ where: { role: 'user' } });
  const productCount = await Product.count();
  const categoryCount = await Category.count();
  const subcategoryCount = await Subcategory.count();

  res.json({
    totalUsers,
    adminCount,
    userCount,
    productCount,
    categoryCount,
    subcategoryCount
  });
}));

export default router;

