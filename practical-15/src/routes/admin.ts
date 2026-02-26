import { Router } from 'express';
import { User } from '../models/Index';
import { Category, Subcategory, Product } from '../models/Index';
import { auth } from '../middleware/auth';
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

