
import express from 'express';
import authService from '../services/authService.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const result = await authService.signup(email, password, role);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const result = await authService.login(email, password);
    return res.json({ success: true, ...result });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(401).json({ success: false, message: error.message || 'Authentication failed' });
  }
});

router.post('/verify-mfa', async (req, res) => {
  try {
    const { userId, token } = req.body;
    const result = await authService.verifyMFA(userId, token);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

export default router;
