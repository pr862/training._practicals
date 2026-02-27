import { Router } from 'express';
import { Product, UserFavorite, User, Category } from '../models/Index';
import { auth, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate, productIdValidation, feedbackValidation } from '../middleware/validation';
import { sendFeedbackEmail } from '../utils/feedbackEmail';

const router = Router();

router.use(auth);


router.get('/favorites', asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  
  const favorites = await UserFavorite.findAll({
    where: { userId },
    include: [
      { 
        model: Product, 
        as: 'Product',
        include: [
          { model: Category, as: 'Category' },
        ]
      }
    ]
  });

  const products = favorites.map(fav => (fav as any).Product);
  res.json(products);
}));

router.post('/favorites/:id',
  validate(productIdValidation),
  asyncHandler(async (req: AuthRequest, res) => {
    const userId = req.user!.id;
    const { id: productId } = req.params;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existingFavorite = await UserFavorite.findOne({
      where: { userId, productId: parseInt(productId) }
    });

    if (existingFavorite) {
      return res.status(400).json({ message: 'Product already in favorites' });
    }

    const favorite = await UserFavorite.create({
      userId,
      productId: parseInt(productId)
    });

    res.status(201).json({ message: 'Product added to favorites', favorite });
  })
);

router.delete('/favorites/:id',
  validate(productIdValidation),
  asyncHandler(async (req: AuthRequest, res) => {
    const userId = req.user!.id;
    const { id: productId } = req.params;

    const favorite = await UserFavorite.findOne({
      where: { userId, productId: parseInt(productId) }
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Product not in favorites' });
    }

    await favorite.destroy();
    res.json({ message: 'Product removed from favorites' });
  })
);

router.get('/favorites/:id/check',
  validate(productIdValidation),
  asyncHandler(async (req: AuthRequest, res) => {
    const userId = req.user!.id;
    const { id: productId } = req.params;

    const favorite = await UserFavorite.findOne({
      where: { userId, productId: parseInt(productId) }
    });

    res.json({ isFavorited: !!favorite });
  })
);

router.post('/feedback',
  validate(feedbackValidation),
  asyncHandler(async (req: AuthRequest, res) => {
    const userId = req.user!.id;
    const { subject, message } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await sendFeedbackEmail({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      subject,
      message
    });

    res.status(200).json({ 
      success: true,
      message: 'Feedback sent successfully. Thank you for your input!' 
    });
  })
);

router.get('/profile', asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  
  const user = await User.findByPk(userId, {
    attributes: ['id', 'name', 'email', 'role', 'createdAt']
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const favoriteCount = await UserFavorite.count({ where: { userId } });

  res.json({
    ...user.toJSON(),
    favoriteCount
  });
}));

router.put('/profile', asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { name, email } = req.body;

  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
  }

  await user.update({ name, email });
  
  res.json({ 
    message: 'Profile updated successfully',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
}));

export default router;

