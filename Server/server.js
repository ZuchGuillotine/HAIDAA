
import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import authRoutes from './src/routes/authroutes.js';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://0.0.0.0:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(json());

// Mount Routes
app.use('/api/auth', authRoutes);

// Default Error Handling
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
