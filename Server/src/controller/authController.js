
import express from 'express';
import AuthService from '../services/authService.js';
import UserRepository from '../repositories/userRepository.js';

const router = express.Router();
const authService = new AuthService(new UserRepository());

router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('Missing registration fields');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const result = await authService.register(email, password);
    console.log('Registration successful for:', email);
    res.json(result);
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(error.message === 'User already exists' ? 409 : 500).json({
      success: false,
      message: error.message || 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', { email: req.body.email });
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('Missing login credentials');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const result = await authService.login(email, password);
    console.log('Login successful for:', email);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(401).json({
      success: false,
      message: error.message || 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;
