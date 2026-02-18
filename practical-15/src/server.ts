import express from 'express';
import dotenv from 'dotenv';
import { sequelize } from './models/Index';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
app.use(express.json());

import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import publicRoutes from './routes/public.routes';

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to the API', endpoints: ['/api/auth', '/api/admin', '/api/public'] });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3500;

sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to sync database:', err);
});

