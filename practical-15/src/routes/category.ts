import { Router } from 'express';
import { Category } from '../models/Index';
import { auth } from '../middleware/auth';
import { adminOnly } from '../middleware/admin';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  validate,
  categoryValidation,
  categoryIdValidation
} from '../middleware/validation';

const router = Router();

router.use(auth);

router.get('/', asyncHandler(async (req, res) => {
  const categories = await Category.findAll();
  res.json(categories);
}));

router.get('/:id/subcategories', asyncHandler(async (req, res) => {
  const subcategories = await Category.findAll({
    where: { parent_id: parseInt(req.params.id) }
  });
  res.json(subcategories);
}));

router.get('/:id',
  validate(categoryIdValidation),
  asyncHandler(async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  })
);

router.post('/',
  auth,
  adminOnly,
  validate(categoryValidation),
  asyncHandler(async (req, res) => {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  })
);

router.put('/:id',
  auth,
  adminOnly,
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

router.delete('/:id',
  auth,
  adminOnly,
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

export default router;
