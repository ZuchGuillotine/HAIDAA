
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './src/routes/authroutes.js';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://0.0.0.0:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(bodyParser.json());

// Mount Routes
app.use('/api/auth', authRoutes);

// Debug logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Default Error Handling
app.use((req, res) => {
  console.log('404 Error:', req.originalUrl);
  res.status(404).json({ message: 'Endpoint not found' });
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
