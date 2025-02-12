// src/routes/authroutes.js
import express from 'express';
import authService from '../services/authService.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Test endpoint to verify auth
router.get('/verify', verifyToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Add a test route to verify the router is mounted
router.get('/test', (req, res) => {
  console.log('Auth router test endpoint hit');
  res.json({ message: 'Auth router is working' });
});

router.post('/login', async (req, res) => {
  console.log('Login endpoint hit');
  console.log('Login request body:', req.body);

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    const result = await authService.login(email, password);
    if (!result) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    console.log('Login successful:', { token: '[HIDDEN]' });

    const token = jwt.sign(
      { userId: result.user.id, email: result.user.email, role: result.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    return res.status(200).json({
      success: true,
      token,
      user: result.user
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(401).json({ 
      success: false, 
      message: error.message || 'Authentication failed' 
    });
  }
});

export default router;