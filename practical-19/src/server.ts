import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { sequelize } from './models';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://music-web-43mv.onrender.com",
  "https://music-web2.onrender.com"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);
app.use('/uploads', express.static('uploads'));

app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Music App API is running' });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    success: false,
    message: "Internal Server Error",
  });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();

    await sequelize.sync({
      force: process.env.NODE_ENV === 'development',
      alter: process.env.NODE_ENV !== 'development'
    });

    app.listen(PORT);

  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

startServer();

export default app;