// server/src/controllers/authController.js
const express = require('express');
const router = express.Router();
const AuthService = require('../services/authService');
const UserRepository = require('../repositories/userRepository');

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
    // Implement MFA verification logic
    res.json({ success: true, message: 'MFA verified' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'MFA verification failed' });
  }
});

router.post('/logout', (req, res) => {
  // Implement logout logic
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;