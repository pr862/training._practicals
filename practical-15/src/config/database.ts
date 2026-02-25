import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'ecommerce',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '123456',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: parseInt(process.env.DB_PORT || '5432', 10),
  }
);

sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Unable to connect to DB:', err));
export default sequelize;
