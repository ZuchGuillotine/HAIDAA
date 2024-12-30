// server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRouter from './src/routes/authroutes.js';

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Test root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Server root endpoint' });
});

// Mount auth routes with explicit path logging
app.use('/api/auth', (req, res, next) => {
  console.log('Auth route hit:', req.path);
  next();
}, authRouter);

// Add test endpoint for auth router
app.get('/api/auth/test', (req, res) => {
  res.json({ message: 'Auth router test endpoint' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('404 Error - Route not found:', req.originalUrl);
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT}`);
  console.log('Available endpoints:');
  console.log(`- GET  /`);
  console.log(`- GET  /api/auth/test`);
  console.log(`- POST /api/auth/login`);
});