import { Router } from 'express';
import { Subcategory, Category } from '../models/Index';
import { auth } from '../middleware/auth';
import { adminOnly } from '../middleware/admin';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  validate,
  subcategoryValidation,
  subcategoryIdValidation
} from '../middleware/validation';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const subcategories = await Subcategory.findAll({
    include: [{ model: Category, as: 'Category' }]
  });
  res.json(subcategories);
}));

router.get('/:id',
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

router.post('/',
  auth,
  adminOnly,
  validate(subcategoryValidation),
  asyncHandler(async (req, res) => {
    const subcategory = await Subcategory.create(req.body);
    res.status(201).json(subcategory);
  })
);

router.put('/:id',
  auth,
  adminOnly,
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

router.delete('/:id',
  auth,
  adminOnly,
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

export default router;
