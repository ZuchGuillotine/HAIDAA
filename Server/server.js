import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './src/routes/authroutes.js';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// Request logging middleware (Removed from edited code, but this is probably needed)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Health check route (Removed from edited code, but this is probably needed)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Internal server error'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});