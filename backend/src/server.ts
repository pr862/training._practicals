import "dotenv/config";
import express, { Request, Response } from "express";
import cors from 'cors';
import authRoutes from "./routes/auth";
import recipesRoutes from "./routes/recipes";

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipesRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app

