import { Router, Response } from 'express';
import { Category } from '../models/Index';
import { auth, AuthRequest } from '../middleware/auth';
import { adminOnly } from '../middleware/admin';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  validate,
  categoryValidation,
  categoryIdValidation
} from '../middleware/validation';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const adminId = req.query.adminId;
  
  const where: any = {};
  
  if (adminId) {
    where.adminId = parseInt(adminId as string);
  }
  
  const categories = await Category.findAll({ where });
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
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const adminId = req.user!.id;
    
    const categoryData = {
      ...req.body,
      adminId: adminId,
    };
    
    const category = await Category.create(categoryData);
    res.status(201).json(category);
  })
);

router.put('/:id',
  auth,
  adminOnly,
  validate([...categoryIdValidation, ...categoryValidation]),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const adminId = req.user!.id;
    
    const category = await Category.findOne({
      where: {
        id: req.params.id,
        adminId: adminId
      }
    });
    if (!category) {
      return res.status(404).json({ message: 'Category not found or you do not have permission to edit it' });
    }
    await category.update(req.body);
    res.json(category);
  })
);

router.delete('/:id',
  auth,
  adminOnly,
  validate(categoryIdValidation),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const adminId = req.user!.id;
    
    const category = await Category.findOne({
      where: {
        id: req.params.id,
        adminId: adminId
      }
    });
    if (!category) {
      return res.status(404).json({ message: 'Category not found or you do not have permission to delete it' });
    }
    await category.destroy();
    res.json({ message: 'Category deleted successfully' });
  })
);

export default router;
