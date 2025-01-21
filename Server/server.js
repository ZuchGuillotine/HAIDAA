import express from 'express';
import cors from 'cors';
import authRouter from './src/controller/authController.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mount auth routes
app.use('/api/auth', authRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});