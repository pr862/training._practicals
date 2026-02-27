import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { sequelize } from './models/Index';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import categoryRoutes from './routes/category';
import productRoutes from './routes/product';
import userRoutes from './routes/user';

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);


app.use(errorHandler);

const PORT = process.env.PORT!;

sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to sync database:', err);
});

