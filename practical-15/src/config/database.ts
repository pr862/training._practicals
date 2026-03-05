import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, {
      dialect: 'postgres',
    })
  : new Sequelize(
      process.env.DB_NAME!,
      process.env.DB_USER!,
      process.env.DB_PASSWORD!,
      {
        host: process.env.DB_HOST!,
        dialect: 'postgres',
        port: parseInt(process.env.DB_PORT!, 10),
      }
    );

sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Unable to connect to DB:', err));
export default sequelize;
