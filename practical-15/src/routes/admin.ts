import { Router, Response } from 'express';
import { User } from '../models/Index';
import { Category, Product } from '../models/Index';
import { auth, AuthRequest } from '../middleware/auth';
import { adminOnly } from '../middleware/admin';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate, userIdValidation } from '../middleware/validation';

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

router.get('/analytics', asyncHandler(async (req: AuthRequest, res: Response) => {
  const adminId = req.user!.id;
  
  // Get stats for the current admin only
  const productCount = await Product.count({ where: { adminId } });
  const categoryCount = await Category.count({ where: { adminId } });
  
  // Total users (admins can still see all users)
  const totalUsers = await User.count();
  const adminCount = await User.count({ where: { role: 'admin' } });
  const userCount = await User.count({ where: { role: 'user' } });

  res.json({
    totalUsers,
    adminCount,
    userCount,
    productCount,
    categoryCount
  });
}));

// New endpoint to get admin's own products
router.get('/products', asyncHandler(async (req: AuthRequest, res: Response) => {
  const adminId = req.user!.id;
  
  const products = await Product.findAll({
    where: { adminId },
    order: [['createdAt', 'DESC']]
  });
  res.json(products);
}));

// New endpoint to get admin's own categories
router.get('/categories', asyncHandler(async (req: AuthRequest, res: Response) => {
  const adminId = req.user!.id;
  
  const categories = await Category.findAll({
    where: { adminId }
  });
  res.json(categories);
}));

export default router;

