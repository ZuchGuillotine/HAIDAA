// server.js
import express from 'express';
import cors from 'cors';
import authRouter from './src/routes/authroutes.js';

const app = express();

// CORS configuration specific to Replit - already robust
app.use(cors({
  origin: true,
  credentials: true
}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());
app.use(cors());

// Placeholder JWT verification middleware - REPLACE THIS WITH ACTUAL IMPLEMENTATION
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(403).json({ message: 'Token is missing' });
  // In a real application, verify the token here using a library like jsonwebtoken
  // Example: const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // req.user = decoded;
  next();
};


// Protected route example
app.use('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Mount auth routes with explicit paths
app.use('/api/auth', authRouter);

// Add route logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Add a catch-all route for debugging
app.use('*', (req, res) => {
  console.log('Request received:', req.method, req.originalUrl);
  res.status(404).json({ message: 'Route not found' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Internal server error' 
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});