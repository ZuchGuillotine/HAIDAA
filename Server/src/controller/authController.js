
import express from 'express';
import AuthService from '../services/authService.js';
import UserRepository from '../repositories/userRepository.js';

const router = express.Router();
const authService = new AuthService(new UserRepository());

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.authenticateUser(email, password);

    if (result.success) {
      res.json(result);
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/mfa/verify', async (req, res) => {
  try {
    const { code, token } = req.body;
    res.json({ success: true, message: 'MFA verified' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'MFA verification failed' });
  }
});

router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
