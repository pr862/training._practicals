import { Router } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { sendWelcomeEmail } from '../utils/email';
import { generateToken } from '../utils/jwt';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate, adminSignupValidation, userSignupValidation, loginValidation } from '../middleware/validation';

const router = Router();


router.post('/admin/signup',
  validate(adminSignupValidation),
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    const token = generateToken(admin.id, admin.role);

    res.status(201).json({ token });
  })
);

router.post('/user/signup',
  validate(userSignupValidation),
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });

    const token = generateToken(user.id, user.role);

    await sendWelcomeEmail(user.email, user.name);

    res.status(201).json({ token });
  })
);

router.post('/login',
  validate(loginValidation),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user.id, user.role);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  })
);

export default router;

