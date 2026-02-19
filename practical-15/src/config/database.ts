import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
  'ecommerce',
  'postgres',
  '123456',
  {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
  }
);

sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Unable to connect to DB:', err));
export default sequelize;